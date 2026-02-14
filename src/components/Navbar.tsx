"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import NavbarDropdown from "./NavbarDropdown";
import { BookOpen, Loader, Loader2, Orbit, Plus } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { ToggleTheme } from "./ToggleTheme";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useUser } from "../hooks/useUser";

const Navbar = () => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const { user: dbUser, isPending } = useUser(user?.username);

  const url = useSearchParams();
  const pathname = usePathname();

  const isOverviewPath = pathname === "/" + user?.username && !url.get("tab");

  const isOrbitsPath = url.get("tab") === "orbits";
  const isHomePagePath = pathname === "/";

  const isOrbitAndOverviewPath = isOrbitsPath || isOverviewPath;

  return (
    <div
      className={`pt-5 px-5 ${isOrbitAndOverviewPath ? "pb-2" : "pb-5"} dark:bg-black border-b`}
    >
      <div className="flex items-center justify-between w-full">
        <Link
          href={`/`}
          className="text-xl font-medium flex items-center gap-3"
        >
          <Image
            src="/finallogo.jpg"
            alt="Logo"
            width={20}
            height={20}
            className="dark:invert invert-0"
          />
          kodehole
        </Link>

        <div className="flex h-5 items-center">
          {isHomePagePath ? (
            <div>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/${user?.username}`}>Profile</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/${user?.username}?tab=orbits`}>Orbits</Link>
              </Button>

              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button size="icon-sm" variant="outline" asChild>
                    <Link href={`/${user?.username}/create-orbit`}>
                      <Orbit />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create Orbit</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
          <Separator
            orientation="vertical"
            className="mx-5 border opacity-70"
          />
          <ToggleTheme />

          <Separator
            orientation="vertical"
            className="mx-5 border opacity-70"
          />

          {isLoading || isPending ? (
            <Skeleton className="w-8 h-8 rounded-full" />
          ) : (
            <div>
              {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Button size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              ) : (
                <NavbarDropdown dbUser={dbUser} user={user} />
              )}
            </div>
          )}
        </div>
      </div>
      {isOrbitAndOverviewPath && (
        <div>
          {isLoading || isPending ? (
            <div className="w-full mt-3 flex items-center gap-5">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          ) : (
            <div className="w-full mt-3 flex items-center gap-5">
              <div className={`flex flex-col relative items-center gap-2`}>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/${user?.username}`}>
                    <BookOpen />
                    Overview
                  </Link>
                </Button>
                {isOverviewPath && (
                  <span className="mx-5 absolute -bottom-2 dark:bg-white bg-black opacity-70 h-0.5 w-full"></span>
                )}
              </div>
              <div className={`flex flex-col relative items-center gap-2`}>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/${user?.username}?tab=orbits`}>
                    <Orbit />
                    Orbits
                  </Link>
                </Button>
                {isOrbitsPath && (
                  <span className="mx-5 absolute -bottom-2 dark:bg-white bg-black opacity-70 h-0.5 w-full"></span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
