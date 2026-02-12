import { Button } from "@/components/ui/button";
import Image from "next/image";
import signInWithGithub from "../action/sigin-with-github";

export default function LoginWithGithub() {
  return (
    <Button
      onClick={() => signInWithGithub()}
      variant="outline"
      type="submit"
      className="w-full"
    >
      <Image src="/github_dark.svg" alt="Github" width={15} height={15} />
      Continue with GitHub
    </Button>
  );
}
