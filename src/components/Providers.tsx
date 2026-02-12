"use client";

import { ThemeProvider } from "../components/theme-provider";
import "leaflet/dist/leaflet.css";
import NextTopLoader from "nextjs-toploader";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "../context/AuthContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader color="white" height={2} showSpinner={false} />

            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default Providers;
