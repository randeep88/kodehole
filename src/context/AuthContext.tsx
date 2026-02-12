"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
  user: any;
  setUser: (user: any) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
} | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const { data: session, status } = useSession() as any;

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
