"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useOrbits } from "../hooks/useOrbits";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "../lib/formatDate";

const OrbitPageComp = ({ orbit }: { orbit: any }) => {
  const { data: session } = useSession() as any;
  const { snapshots, isLoadingSnapshots } = useOrbits(orbit?.name);

  if (isLoadingSnapshots) {
    return <div>Loading snapshots...</div>;
  }

  return (
    <div className="pt-10 w-4xl mx-auto">
      <div className="text-xl font-semibold flex items-center gap-3">
        <Avatar className="w-7 h-7">
          <AvatarImage src={session?.user?.image!} alt={session?.user?.name!} />
          <AvatarFallback className="text-xs">
            {session?.user?.name?.split(" ")[0][0]}
            {session?.user?.name?.split(" ")[1][0]}
          </AvatarFallback>
        </Avatar>
        {orbit?.name}
        <Badge variant="secondary">{orbit?.visibility}</Badge>
      </div>
      <Separator className="my-5" />

      <Card className="h-fit p-0 overflow-hidden shadow-none">
        <CardContent className="p-0 h-fit">
          <div className="py-4 bg-card px-5 flex items-center justify-between">
            <div></div>
            <div className="text-muted-foreground text-xs">
              {snapshots?.length} snapshots
            </div>
          </div>
          {snapshots?.map((snapshot: any) => (
            <div key={snapshot._id} className="w-full border-t p-2 px-5">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="link"
                  className="text-base font-medium p-0"
                  asChild
                >
                  <Link
                    href={`/${session?.user?.username}/orbits/${orbit.name}/s${snapshot.index}?o=${orbit.name}`}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default OrbitPageComp;
