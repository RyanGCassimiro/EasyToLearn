import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
import { auth, db } from '../lib/firebase';

export type Role = 'admin' | 'user';

export type User = {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string, role: Role) => Promise<void>;
  signUp: (data: Omit<User, 'uid'> & { password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'wan@gmail.com': {
    uid: 'uid_123',
    name: 'Wanessa',
    email: 'wan@gmail.com',
    role: 'admin',
  },
  'anne@gmail.com': {
    uid: 'uid_456',
    name: 'Anne',
    email: 'anne@gmail.com',
    role: 'user',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const useFirebase = !!auth;

  useEffect(() => {
    if (!useFirebase) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      if (firebaseUser && db) {
        try {
          const snapshot = await get(child(ref(db), `usuarios/${firebaseUser.uid}`));
          if (snapshot.exists()) {
            setUser(snapshot.val() as User);
          } else {
            const mockUser = MOCK_USERS[firebaseUser.email || ''];
            if (mockUser) {
              setUser({ ...mockUser, uid: firebaseUser.uid });
            } else {
              setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                role: 'user',
              });
            }
          }
        } catch (error) {
          console.warn('Error loading user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [useFirebase]);

  const signIn = async (email: string, password: string, role: Role) => {
    if (useFirebase && auth) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const mockUser = MOCK_USERS[email];
        if (mockUser && mockUser.role === role) {
          const userData: User = { ...mockUser, uid: result.user.uid };
          setUser(userData);

          if (db) {
            try {
              await set(ref(db, `usuarios/${result.user.uid}`), userData);
            } catch (dbError) {
              console.warn('Error saving user to database:', dbError);
            }
          }
        } else {
          throw new Error('Cargo não corresponde ao cadastro.');
        }
      } catch (error: any) {
        throw new Error('Credenciais inválidas.');
      }
    } else {
      const found = MOCK_USERS[email];
      if (found && found.role === role) {
        setUser(found);
      } else {
        throw new Error('Credenciais inválidas ou cargo incorreto.');
      }
    }
  };

  const signUp = async (data: Omit<User, 'uid'> & { password: string }) => {
    const { password, ...userData } = data;

    if (useFirebase && auth) {
      try {
        const result = await createUserWithEmailAndPassword(auth, userData.email, password);
        const newUser: User = { uid: result.user.uid, ...userData };
        setUser(newUser);

        if (db) {
          try {
            await set(ref(db, `usuarios/${result.user.uid}`), newUser);
          } catch (dbError) {
            console.warn('Error saving new user to database:', dbError);
          }
        }
      } catch (error: any) {
        throw new Error('Erro ao criar conta.');
      }
    } else {
      const newUser: User = { uid: `mock-uid-${Date.now()}`, ...userData };
      setUser(newUser);
    }
  };

  const signOut = async () => {
    if (useFirebase && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
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
