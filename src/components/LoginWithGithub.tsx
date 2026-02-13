import { Button } from "@/components/ui/button";
import Image from "next/image";
import signInWithGithub from "../action/sigin-with-github";

export default function LoginWithGithub({ username }: { username: string }) {
  return (
    <Button
      onClick={() => signInWithGithub({ username })}
      variant="outline"
      type="submit"
      className="w-full"
    >
      <Image src="/github_dark.svg" alt="Github" width={15} height={15} />
      Continue with GitHub
    </Button>
  );
}
