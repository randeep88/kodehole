"use server";

import { signIn } from "@/auth";

const signInWithGithub = async ({ username }: { username: string }) => {
  await signIn("github", { redirectTo: "/", username });
};

export default signInWithGithub;
