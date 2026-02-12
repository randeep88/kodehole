import { Button } from "@/components/ui/button";
import Image from "next/image";
import signInWithGoogle from "../action/sigin-with-google";

export default function LoginWithGoogle() {
  return (
    <Button
      onClick={() => signInWithGoogle()}
      variant="outline"
      type="submit"
      className="w-full"
    >
      <Image src="/google.svg" alt="Google" width={15} height={15} />
      Continue with Google
    </Button>
  );
}
