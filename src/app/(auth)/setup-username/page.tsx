import { Suspense } from "react";
import SetupUsernamePageClient from "./SetupUsernamePageClient";

export default function SetupUsernamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SetupUsernamePageClient />
    </Suspense>
  );
}
