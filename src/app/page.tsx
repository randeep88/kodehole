"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";

const page = () => {
  const { data: session, status } = useSession() as any;
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      if (!session.user.usernameSet || session.user.isNewUser) {
        router.push(`/setup-username?email=${session.user?.email}`);
      }
    }
  }, [session, status, router]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>
      <HeroSection />
    </div>
  );
};

export default page;
