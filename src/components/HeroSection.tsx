"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import PixelBlast from "@/components/PixelBlast";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Hero() {
  const { data: session } = useSession() as any;
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const [copiedId, setCopiedId] = useState("");

  return (
    <div className="dark:bg-black text-white min-h-[calc(100vh-70px)] flex items-center justify-center px-4 relative">
      <div
        style={{
          opacity: 0.4,
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: "",
          top: 0,
          left: 0,
        }}
      >
        <PixelBlast
          variant="square"
          pixelSize={4}
          color={theme === "dark" ? "white" : "black"}
          patternScale={2}
          patternDensity={0.2}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.2}
          rippleThickness={0.12}
          rippleIntensityScale={1}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0}
          transparent
        />
      </div>

      <div className="max-w-3xl w-full space-y-8">
        <div className="space-y-4 text-center">
          <Badge variant="outline" className="border-border backdrop-blur-xs">
            CLI-First Code Snapshot Platform
          </Badge>

          <h1 className="text-5xl font-bold tracking-tight dark:text-white text-black">
            A New Home for Your Code.
          </h1>

          <p className="text-xl dark:text-white text-black">
            Kodehole is a version control platform for code snapshots, not
            commits. <br /> Create Orbits. Push code. Every snapshot is
            permanent and never overwritten.
          </p>
        </div>

        <div className="border border-border backdrop-blur-xs overflow-hidden rounded-xl w-[90%] mx-auto">
          <div className="flex items-center justify-between px-4 py-1 dark:bg-card bg-border/70 border-b border-border">
            <div className="flex gap-2 text-sm text-muted-foreground">bash</div>
            <Button
              variant="ghost"
              size="xs"
              className="backdrop-blur-xs dark:text-white text-black"
              onClick={() => {
                navigator.clipboard.writeText("kdh push my-orbit");
                setCopied(true);
                setCopiedId("push");
                setTimeout(() => {
                  setCopied(false);
                  setCopiedId("");
                }, 2000);
              }}
            >
              {copied && copiedId === "push" ? <Check /> : <Copy />}
              <span>{copied && copiedId === "push" ? "Copied!" : "Copy"}</span>
            </Button>
          </div>

          <div className="p-3 font-mono dark:bg-card/70 bg-border/30 text-sm">
            <span className="dark:text-white text-black text-base">
              kdh push my-orbit
            </span>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            size="lg"
            variant="default"
            onClick={() => {
              if (!session) {
                if (session?.user?.usernameSet || session?.user?.isNewUser) {
                  router.push(`/setup-username?email=${session?.user?.email}`);
                }
                router.push("/login");
              } else {
                router.push(`/${session?.user?.username}`);
              }
            }}
            className="backdrop-blur-xs"
          >
            Get Started
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                variant="outline"
                className="backdrop-blur-xs bg-transparent dark:text-white text-black"
              >
                Install CLI
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Install Kodehole CLI</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Install globally using npm:
                  </h1>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "npm install -g kodehole-cli",
                        );
                        setCopied(true);
                        setCopiedId("install-cli");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "install-cli" ? (
                        <Check />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 px-3">npm install -g kodehole-cli</div>
                </div>
                <p className="text-muted-foreground">
                  Install the Kodehole CLI globally to use it from your
                  terminal.
                </p>
              </div>
              <div className="space-y-2 mt-5">
                <div>
                  <h1 className="text-primary font-medium">
                    Verify installation:
                  </h1>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText("kdh --version");
                        setCopied(true);
                        setCopiedId("verify-installation");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "verify-installation" ? (
                        <Check />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh --version</div>
                </div>
                <p className="text-muted-foreground">
                  If the version prints successfully, you're ready to push your
                  project.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
