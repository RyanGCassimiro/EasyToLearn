import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../lib/firebase';

export type Role = 'admin' | 'morador' | 'comercio';

export type User = {
  uid: string;
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: Omit<User, 'uid'> & { password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function loadUserFromDB(uid: string): Promise<User | null> {
  if (!db) return null;
  try {
    const snapshot = await get(ref(db, `usuarios/${uid}`));
    if (snapshot.exists()) return snapshot.val() as User;
  } catch (e) {
    console.warn('Erro ao ler usuário do banco:', e);
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.getIdToken(true);
        const userData = await loadUserFromDB(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase não configurado.');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged cuida de setar o user automaticamente
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential')
        throw new Error('E-mail ou senha incorretos.');
      throw new Error('Erro ao fazer login.');
    }
  };

  const signUp = async (data: Omit<User, 'uid'> & { password: string }) => {
    if (!auth) throw new Error('Firebase não configurado.');
    const { password, ...userData } = data;
    try {
      const result = await createUserWithEmailAndPassword(auth, userData.email, password);
      const newUser: User = { uid: result.user.uid, ...userData };

      // Salva no banco ANTES de fazer logout
      if (db) {
        await result.user.getIdToken(true);
        await set(ref(db, `usuarios/${result.user.uid}`), newUser);
      }

      // Faz logout para o usuário confirmar pelo login
      await firebaseSignOut(auth);
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/email-already-in-use') throw new Error('Este e-mail já está cadastrado.');
      if (code === 'auth/invalid-email') throw new Error('E-mail inválido.');
      if (code === 'auth/weak-password') throw new Error('Senha fraca. Use pelo menos 6 caracteres.');
      if (code === 'auth/operation-not-allowed') throw new Error('Cadastro por e-mail não está habilitado no Firebase.');
      throw new Error(error?.message || 'Erro ao criar conta.');
    }
  };

  const signOut = async () => {
    if (auth) {
      try { await firebaseSignOut(auth); } catch (e) {}
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
