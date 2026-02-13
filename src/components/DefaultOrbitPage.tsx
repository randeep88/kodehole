"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useOrbits } from "@/src/hooks/useOrbits";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUser } from "../hooks/useUser";

const DefaultOrbitPage = ({ orbit }: { orbit: string }) => {
  const { user, isLoading } = useAuth();
  const { user: dbUser } = useUser(user?.username!);
  const { orbit: orbitData, isLoadingOrbit } = useOrbits(orbit);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState("");

  return (
    <div className="pt-10 w-4xl mx-auto pb-50">
      <div className="text-xl font-semibold flex items-center gap-3">
        {isLoading ? (
          <Skeleton className="w-7 h-7 rounded-full" />
        ) : (
          <Avatar className="w-7 h-7">
            <AvatarImage src={dbUser?.data?.image!} alt={dbUser?.data?.name!} />
            <AvatarFallback className="text-xs">
              {dbUser?.data?.name?.split(" ")[0][0]}
              {dbUser?.data?.name?.split(" ")[1][0]}
            </AvatarFallback>
          </Avatar>
        )}
        {<p>{orbit}</p>}
        <Badge variant="secondary">
          {isLoadingOrbit ? (
            <Skeleton className="w-8 h-4" />
          ) : (
            orbitData?.data?.orbitData?.visibility
          )}
        </Badge>
      </div>
      <Separator className="my-5" />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Orbit created successfully 🚀
          </CardTitle>
          <CardDescription>
            Run the following commands to push your project in this orbit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="existing-project" className="w-full">
            <TabsList className="border-b w-full" variant="line">
              <TabsTrigger className="w-fit" value="existing-project">
                Push to This Orbit (Recommended)
              </TabsTrigger>
              <TabsTrigger className="w-fit" value="new-project">
                Create and Push from CLI
              </TabsTrigger>
              <TabsTrigger className="w-fit" value="installation">
                Install CLI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="existing-project" className="space-y-10 mt-5">
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Step 1 — Login to Your Account{" "}
                    <span className="italic text-sm text-muted-foreground">
                      (ignore if already logged in)
                    </span>{" "}
                    :
                  </h1>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText("kdh login");
                        setCopied(true);
                        setCopiedId("login");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "login" ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh login</div>
                </div>
                <p className="text-muted-foreground">
                  Authenticates your CLI with your Kodehole account using your
                  credentials or{" "}
                  <HoverCard openDelay={0} closeDelay={0}>
                    <HoverCardTrigger className="text-primary cursor-pointer">
                      Access Token
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      To authenticate the CLI, generate an Access Token from the
                      Profile dropdown menu.
                    </HoverCardContent>
                  </HoverCard>
                  .
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Step 2 — Initialize Project :
                  </h1>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`kdh init`);
                        setCopied(true);
                        setCopiedId("init");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "init" ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh init</div>
                </div>
                <p className="text-muted-foreground">
                  Initializes a new Kodehole orbit in your current directory.
                </p>
              </div>
              <h1 className="text-primary font-medium mb-4">
                Step 3 — Push to This Orbit :
              </h1>
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    First-Time Push :
                  </h1>
                  <span className="text-muted-foreground">
                    Use this command only once per Orbit.
                  </span>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`kdh push ${orbit}`);
                        setCopied(true);
                        setCopiedId("first-push");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "first-push" ? (
                        <Check />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh push {orbit}</div>
                </div>
                <p className="text-muted-foreground">
                  It links your local project to the specified Orbit and creates
                  the first snapshot.
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Subsequent Pushes :
                  </h1>
                  <span className="text-muted-foreground">
                    Use this command for all future pushes.
                  </span>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`kdh push`);
                        setCopied(true);
                        setCopiedId("push");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "push" ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh push</div>
                </div>
                <p className="text-muted-foreground">
                  Since your project is already linked, you don’t need to
                  specify the Orbit name again. <br /> Each time you run this
                  command, a new snapshot is created in the same Orbit.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="new-project" className="space-y-10 mt-5">
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Step 1 — Login to Your Account{" "}
                    <span className="italic text-sm text-muted-foreground">
                      (ignore if already logged in)
                    </span>{" "}
                    :
                  </h1>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText("kdh login");
                        setCopied(true);
                        setCopiedId("login");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "login" ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh login</div>
                </div>
                <p className="text-muted-foreground">
                  Authenticates your CLI with your Kodehole account using your
                  credentials or{" "}
                  <HoverCard openDelay={0} closeDelay={0}>
                    <HoverCardTrigger className="text-primary cursor-pointer">
                      Access Token
                    </HoverCardTrigger>
                    <HoverCardContent className="text-sm">
                      To authenticate the CLI, generate an Access Token from the
                      Profile dropdown menu.
                    </HoverCardContent>
                  </HoverCard>
                  .
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Step 2 — Create a New Orbit :
                  </h1>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `kdh create <your-orbit-name>`,
                        );
                        setCopied(true);
                        setCopiedId("create");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "create" ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <div className="p-3 px-3">
                    {"kdh create <your-orbit-name>"}
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Initializes a new Kodehole orbit in your current directory.
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Step 3 — Initialize Project :
                  </h1>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`kdh init`);
                        setCopied(true);
                        setCopiedId("init");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "init" ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh init</div>
                </div>
                <p className="text-muted-foreground">
                  Initializes a new Kodehole orbit in your current directory.
                </p>
              </div>
              <h1 className="text-primary font-medium mb-4">
                Step 4 — Push to newly created Orbit :
              </h1>
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    First-Time Push :
                  </h1>
                  <span className="text-muted-foreground">
                    Use this command only once per Orbit.
                  </span>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `kdh push <your-orbit-name>`,
                        );
                        setCopied(true);
                        setCopiedId("first-push");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "first-push" ? (
                        <Check />
                      ) : (
                        <Copy />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 px-3">{"kdh push <your-orbit-name>"}</div>
                </div>
                <p className="text-muted-foreground">
                  It links your local project to the specified Orbit and creates
                  the first snapshot.
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <h1 className="text-primary font-medium">
                    Subsequent Pushes :
                  </h1>
                  <span className="text-muted-foreground">
                    Use this command for all future pushes.
                  </span>
                </div>
                <div className="dark:bg-card bg-neutral-100 rounded-lg relative">
                  <div className="flex items-center justify-between border-b p-1 px-3">
                    <div className="text-sm text-muted-foreground">bash</div>
                    <Button
                      disabled={isLoadingOrbit}
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(`kdh push`);
                        setCopied(true);
                        setCopiedId("push");
                        setTimeout(() => {
                          setCopied(false);
                          setCopiedId("");
                        }, 2000);
                      }}
                    >
                      {copied && copiedId === "push" ? <Check /> : <Copy />}
                    </Button>
                  </div>
                  <div className="p-3 px-3">kdh push</div>
                </div>
                <p className="text-muted-foreground">
                  Since your project is already linked, you don’t need to
                  specify the Orbit name again. <br /> Each time you run this
                  command, a new snapshot is created in the same Orbit.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="installation" className="space-y-10 mt-5">
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
                      disabled={isLoadingOrbit}
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
                      disabled={isLoadingOrbit}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DefaultOrbitPage;
