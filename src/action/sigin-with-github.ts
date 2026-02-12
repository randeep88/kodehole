"use server";

import { signIn } from "@/auth";

const signInWithGithub = async () => {
  await signIn("github", { redirectTo: "/" });
};

export default signInWithGithub;
