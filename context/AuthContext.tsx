import React, { createContext, useContext, useState } from 'react';

export type Role = 'morador' | 'comercio';

export type User = {
  uid: string;
  nome: string;
  email: string;
  role: Role;
  cpf?: string;
  unidade?: string;
  torre?: string;
  cnpj?: string;
  nome_fantasia?: string;
  responsavel?: string;
};

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string, role: Role) => Promise<void>;
  signUp: (data: Omit<User, 'uid'> & { password: string }) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'morador@easy.com': {
    uid: 'mock-uid-morador',
    nome: 'Bruno Morador',
    email: 'morador@easy.com',
    role: 'morador',
    cpf: '123.456.789-00',
    unidade: '101',
    torre: 'Torre A',
  },
  'comercio@easy.com': {
    uid: 'mock-uid-comercio',
    nome: 'Ana Admin',
    email: 'comercio@easy.com',
    role: 'comercio',
    cnpj: '12.345.678/0001-99',
    nome_fantasia: 'Mercado do Bairro',
    responsavel: 'Ana Admin',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, _password: string, role: Role) => {
    const found = MOCK_USERS[email];
    if (found && found.role === role) {
      setUser(found);
    } else {
      throw new Error('Credenciais inválidas ou cargo incorreto.');
    }
  };

  const signUp = async (data: Omit<User, 'uid'> & { password: string }) => {
    const { password: _, ...userData } = data;
    const newUser: User = { uid: `mock-uid-${Date.now()}`, ...userData };
    setUser(newUser);
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
