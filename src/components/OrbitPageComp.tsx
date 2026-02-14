"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrbits } from "../hooks/useOrbits";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "../lib/formatDate";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";

const OrbitPageComp = ({ orbit }: { orbit: any }) => {
  const { user, isLoading } = useAuth();
  const { user: dbUser } = useUser(user?.username!);
  const { snapshots, isLoadingSnapshots } = useOrbits(orbit?.name);

  return (
    <div className="pt-10 w-4xl mx-auto">
      <div className="text-xl font-semibold flex items-center gap-3">
        {isLoading ? (
          <div>
            <Skeleton className="w-7 h-7 rounded-full" />
          </div>
        ) : (
          <Avatar className="w-7 h-7">
            <AvatarImage src={dbUser?.data?.image!} alt={dbUser?.data?.name!} />
            <AvatarFallback className="text-xs">
              {dbUser?.data?.name?.split(" ")[0][0]}
              {dbUser?.data?.name?.split(" ")[1][0]}
            </AvatarFallback>
          </Avatar>
        )}
        {orbit?.name}
        <Badge variant="secondary">{orbit?.visibility}</Badge>
      </div>
      <Separator className="my-5" />

      <Card className="h-fit p-0 overflow-hidden shadow-none">
        <CardContent className="p-0 h-fit">
          <div className="py-4 bg-card px-5 flex items-center justify-between">
            <div>Snapshots</div>
            {isLoadingSnapshots ? (
              <div>
                <Skeleton className="w-15 h-3" />
              </div>
            ) : (
              <div className="text-muted-foreground text-xs">
                {snapshots?.length}
                {snapshots?.length === 1 ? " snapshot" : " snapshots"}
              </div>
            )}
          </div>

          {isLoadingSnapshots ? (
            <div>
              <div className="w-full border-t p-2 flex items-center justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Skeleton className="w-7 h-7" />
                </div>
                <Skeleton className="w-40 h-4" />
              </div>
              <div className="w-full border-t p-2 flex items-center justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Skeleton className="w-7 h-7" />
                </div>
                <Skeleton className="w-40 h-4" />
              </div>
              <div className="w-full border-t p-2 flex items-center justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Skeleton className="w-7 h-7" />
                </div>
                <Skeleton className="w-40 h-4" />
              </div>
              <div className="w-full border-t p-2 flex items-center justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Skeleton className="w-7 h-7" />
                </div>
                <Skeleton className="w-40 h-4" />
              </div>
              <div className="w-full border-t p-2 flex items-center justify-between">
                <div className="w-10 h-10 flex items-center justify-center">
                  <Skeleton className="w-7 h-7" />
                </div>
                <Skeleton className="w-40 h-4" />
              </div>
            </div>
          ) : (
            <div>
              {snapshots?.map((snapshot: any) => (
                <div key={snapshot._id} className="w-full border-t p-2 px-5">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="link"
                      className="text-base font-medium p-0"
                      asChild
                    >
                      <Link
                        href={`/${user?.username}/orbits/${orbit.name}/s${snapshot.index}?o=${orbit.name}`}
                      >
                        S{snapshot.index}
                      </Link>
                    </Button>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(snapshot.updatedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrbitPageComp;
