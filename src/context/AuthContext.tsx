import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { storage } from "../storage";
import { apiClient } from "../api-client";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.removeUser();
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    storage.setUser(newUser.id, newUser.email, newUser.name, newToken);
  };

  // Load from storage on boot
  useEffect(() => {
    const user = storage.getUser();
    if (user.idToken && user.id) {
      try {
        const { exp } = jwtDecode<{ exp: number }>(user.idToken);
        const expiresIn = exp * 1000 - Date.now();
        if (expiresIn > 0) {
          setToken(user.idToken);
          setUser({ id: user.id, email: user.email, name: user.name });

          // Refresh if less than 3 days remaining
          if (expiresIn < 3 * 24 * 60 * 60 * 1000) {
            apiClient.refresh().then((res) => {
              if (res.data) {
                login(res.data.accessToken, res.data.user);
              }
            });
          }

          // If user hasn't refreshed page, force logout
          setTimeout(() => {
            logout();
          }, expiresIn);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for components to use
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
