"use server";

import { signIn } from "@/auth";

const signInWithGoogle = async ({ username }: { username: string }) => {
  await signIn("google", { redirectTo: "/", username });
};

export default signInWithGoogle;
