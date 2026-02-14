"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Check,
  Copy,
  Key,
  Loader2,
  LogOut,
  Orbit,
  TriangleAlert,
  User,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCLIToken } from "../hooks/useCLIToken";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NavbarDropdown = ({ user, dbUser }: { user: any; dbUser: any }) => {
  const router = useRouter();
  const [openToken, setOpenToken] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { generateCLIToken, isGeneratingCLIToken } = useCLIToken();

  const handleGenerateToken = () => {
    generateCLIToken(undefined, {
      onSuccess: (data) => {
        setToken(data.token);
      },
    });
  };

  const crrUser = user || dbUser?.data;

  const userImage = user?.image || dbUser?.data?.image;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar>
            <AvatarImage src={userImage!} alt={crrUser?.name!} />
            <AvatarFallback className="text-xs">
              {crrUser?.name?.split(" ")[0][0]}
              {crrUser?.name?.split(" ")[1][0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-50" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={userImage!} alt={crrUser?.name!} />
                <AvatarFallback className="text-xs">
                  {crrUser?.name?.split(" ")[0][0]}
                  {crrUser?.name?.split(" ")[1][0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-popover-foreground">
                  {dbUser?.data?.username}
                </span>
                <span className="text-muted-foreground text-xs">
                  {dbUser?.data?.name}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push(`/${user?.username}`)}>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/${user?.username}?tab=orbits`)}
            >
              <Orbit />
              Orbits
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenToken(true)}>
              <Key />
              Access Token
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={openToken} onOpenChange={setOpenToken}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="w-full">
              <div className="text-lg font-semibold flex items-center justify-between w-full">
                <p>Generate CLI Access Token</p>
                <Button
                  onClick={() => {
                    setOpenToken(false);
                    setToken(null);
                  }}
                  variant="ghost"
                  size="icon-sm"
                >
                  <X />
                </Button>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This token allows your local CLI to securely interact with your
              Kodehole account. Use it to push projects, create snapshots, and
              manage your Orbits from the terminal.
            </AlertDialogDescription>

            <Alert>
              <TriangleAlert color="orange" />
              <AlertTitle>This token will only be shown once.</AlertTitle>
              <AlertDescription>
                Make sure to copy and store it securely. Anyone with this token
                can access your Orbits from the CLI.
              </AlertDescription>
            </Alert>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center gap-2 w-full">
            {token ? (
              <div className="flex items-center gap-3 w-full">
                <Input type="text" value={token!} readOnly className="w-full" />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(token!);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                    toast.success("Token copied to clipboard");
                  }}
                >
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleGenerateToken()}>
                {isGeneratingCLIToken ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key />
                    Generate Token
                  </>
                )}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NavbarDropdown;
