import { useState, useCallback } from 'react';
import { validateCredentials } from '../data/auth';

const AUTH_KEY = 'primodel_auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });
  const [error, setError] = useState<string | null>(null);

  const login = useCallback((username: string, password: string): boolean => {
    if (validateCredentials(username, password)) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError(null);
      return true;
    }
    setError('Invalid username or password');
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, error, login, logout };
}
