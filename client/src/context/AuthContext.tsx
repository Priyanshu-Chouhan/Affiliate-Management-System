import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AuthContextValue = {
  token: string | null;
  user: { id: string; email: string; role: 'user' | 'admin' } | null;
  login: (token: string, user: AuthContextValue['user']) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextValue['user'] | null>(null);

  const login = (nextToken: string, nextUser: AuthContextValue['user']) => {
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
