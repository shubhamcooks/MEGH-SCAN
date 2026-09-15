import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserRole, DemoUser } from '@/types';

interface AuthContextValue {
  user: DemoUser | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'megh-scan-user';

const ROLE_NAMES: Record<UserRole, string> = {
  admin: 'Administrator',
  planner: 'Urban Planner',
  public: 'Public User',
  disaster: 'Disaster Management Officer',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (role: UserRole) => {
    const demoUser: DemoUser = { name: ROLE_NAMES[role], role };
    setUser(demoUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
