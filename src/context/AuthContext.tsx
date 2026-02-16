"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";

const AuthContext = createContext<{
  user: any;
  dbUser: any;
  setUser: (user: any) => void;
  setDbUser: (user: any) => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  isLoadingDbUser: boolean;
  isLoadingBoth: boolean;
} | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [dbUser, setDbUser] = useState<any>(null);
  const { data: session, status } = useSession() as any;
  const { user: databaseUser, isPending: isLoadingDbUser } = useUser(
    user?.username,
  );

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  const isLoadingBoth = isLoading || isLoadingDbUser;

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
    if (session?.user) {
      setDbUser(databaseUser?.data);
    }
  }, [session]);
  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        setUser,
        setDbUser,
        isLoading,
        isLoggedIn,
        isLoadingDbUser,
        isLoadingBoth,
      }}
    >
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
