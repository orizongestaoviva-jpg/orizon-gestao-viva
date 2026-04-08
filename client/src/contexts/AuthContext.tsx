/*
 * ORIZON — Gestão Viva
 * AuthContext: Gerencia estado de autenticação e perfil do usuário
 * Suporta três visões: operacional, tático, estratégico
 */

import React, { createContext, useContext, useState } from "react";

export type UserRole = "operacional" | "tatico" | "estrategico" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  position: string;
  avatar?: string;
  company: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  operacional: {
    id: "1",
    name: "Ana Souza",
    email: "ana.souza@empresa.com.br",
    role: "operacional",
    department: "Vendas",
    position: "Consultora de Vendas",
    company: "TechBrasil Ltda.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  tatico: {
    id: "2",
    name: "Carlos Mendes",
    email: "carlos.mendes@empresa.com.br",
    role: "tatico",
    department: "Recursos Humanos",
    position: "Gerente de RH",
    company: "TechBrasil Ltda.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  estrategico: {
    id: "3",
    name: "Fernanda Lima",
    email: "fernanda.lima@empresa.com.br",
    role: "estrategico",
    department: "Diretoria",
    position: "Diretora de Pessoas",
    company: "TechBrasil Ltda.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
  },
  admin: {
    id: "4",
    name: "Roberto Admin",
    email: "admin@orizon.com.br",
    role: "admin",
    department: "Administração",
    position: "Admin Master",
    company: "ORIZON",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole = "tatico") => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
