"use client";

import Navbar from "@/src/components/Navbar";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [dbUser, setDbUser] = useState<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      if (session?.user?.email) {
        const res = await axios.get(
          `/api/users/get-user-by-email?email=${session.user.email}`,
        );
        setDbUser(res.data.data);
      }
    };

    fetchUser();
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (dbUser && !dbUser?.usernameSet) {
      router.push(`/setup-username?email=${session?.user?.email as string}`);
    }
  }, [dbUser]);

  // if (status === "loading" || loading)
  //   return (
  //     <div className="flex items-center justify-center w-full h-screen">
  //       <Loader2 className="animate-spin" size={30} />
  //     </div>
  //   );

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
