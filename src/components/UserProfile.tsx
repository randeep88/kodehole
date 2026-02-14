"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "../hooks/useUser";
import { Card, CardContent } from "@/components/ui/card";
import { useOrbits } from "../hooks/useOrbits";
import {
  Loader2,
  Orbit,
  Plus,
  SearchAlert,
  SearchIcon,
  Check,
  X,
  Pencil,
} from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "../lib/formatDate";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const UserProfile = ({ username }: { username: string }) => {
  const [searchInput, setSearchInput] = useState("");

  const url = useSearchParams();
  const pathname = usePathname();

  const isOrbitsPath = url.get("tab") === "orbits";
  const isOverviewPath = pathname === "/" + username && !url.get("tab");

  const { user: dbUser, updateBio, isUpdatingBio } = useUser(username);
  const { user, isLoading } = useAuth();
  const isOwner = dbUser?.data.email === user?.email;
  const { orbits, isPending } = useOrbits();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredOrbits = orbits?.data?.orbits?.filter((orbit: any) =>
    orbit.name.toLowerCase().includes(searchInput.toLowerCase()),
  );

  useEffect(() => {
    if (dbUser?.data.bio) {
      setBioText(dbUser.data.bio);
    }
  }, [dbUser?.data.bio]);

  useEffect(() => {
    if (isEditingBio && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [isEditingBio]);

  const handleSave = () => {
    updateBio(
      { bio: bioText },
      {
        onSuccess: () => {
          setIsEditingBio(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setBioText(dbUser?.data.bio || "");
    setIsEditingBio(false);
  };

  let loading = isLoading || isPending;

  return (
    <div className="w-full">
      <div className="flex items-start px-50 gap-20">
        {/* LEFT SIDE */}
        <div className="space-y-5 sticky top-10 self-start pt-10">
          {loading ? (
            <Skeleton className="w-70 h-70 rounded-full" />
          ) : (
            <Avatar className="w-70 h-70">
              <AvatarImage src={user?.image!} />
              <AvatarFallback className="text-6xl">
                {user?.name?.split(" ")[0][0]}
                {user?.name?.split(" ")[1][0]}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col items-start gap-2">
            {loading ? (
              <Skeleton className="w-full shrink-0 h-8" />
            ) : (
              <p className="font-medium text-2xl">{dbUser?.data.name}</p>
            )}
            {loading ? (
              <Skeleton className="w-full shrink-0 h-5 mt-2" />
            ) : (
              <p className="font-medium text-xl text-muted-foreground">
                {dbUser?.data.username}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE ---------------------------------------------------- */}

        {/* OVERVIEW PATH ------- */}
        {isOverviewPath && (
          <div className="flex flex-col items-center gap-4 w-full h-full pt-10">
            {loading ? (
              <Skeleton className="w-full shrink-0 h-40 rounded-xl" />
            ) : (
              <Card className="w-full min-h-40 relative p-0 overflow-hidden">
                <div className="flex items-center justify-between p-1 px-4 dark:bg-card bg-neutral-50 border-b border-border/70">
                  <h1>Bio</h1>
                  {isOwner && isEditingBio ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleCancel}
                        disabled={isUpdatingBio}
                      >
                        <X />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleSave}
                        disabled={isUpdatingBio}
                      >
                        {isUpdatingBio ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check />
                        )}
                      </Button>
                    </div>
                  ) : (
                    isOwner && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          if (isOwner && !isEditingBio) {
                            setIsEditingBio(true);
                          }
                        }}
                      >
                        <Pencil />
                      </Button>
                    )
                  )}
                </div>
                {dbUser?.data.bio || isEditingBio ? (
                  <CardContent className="pb-4">
                    {isEditingBio ? (
                      <textarea
                        ref={textareaRef}
                        value={bioText}
                        onChange={(e) => {
                          setBioText(e.target.value);
                          if (textareaRef.current) {
                            textareaRef.current.style.height = "auto";
                            textareaRef.current.style.height =
                              textareaRef.current.scrollHeight + "px";
                          }
                        }}
                        className="w-full min-h-[100px] bg-transparent text-sm font-mono leading-6 resize-none focus:outline-none overflow-hidden"
                        placeholder="Write your bio here..."
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-6">
                        {dbUser?.data.bio}
                      </pre>
                    )}
                  </CardContent>
                ) : (
                  <div
                    className={`flex flex-col items-center justify-center h-15`}
                  >
                    {isOwner ? (
                      <p>You haven't added any bio</p>
                    ) : (
                      <p>This user hasn't added any bio</p>
                    )}
                    <div className="text-muted-foreground text-sm text-center">
                      {isOwner && <p>Click here to add bio.</p>}
                    </div>
                  </div>
                )}
              </Card>
            )}
            {loading ? (
              <Skeleton className="w-30 mr-auto h-5 mt-6" />
            ) : (
              <h1 className="font-medium text-left w-full mt-5">
                {isOwner ? "Your Orbits" : "Orbits"}
              </h1>
            )}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 w-full lg:h-60 shrink-0">
                <Skeleton className="w-full shrink-0 h-25 rounded-xl" />
                <Skeleton className="w-full shrink-0 h-25 rounded-xl" />
                <Skeleton className="w-full shrink-0 h-25 rounded-xl" />
                <Skeleton className="w-full shrink-0 h-25 rounded-xl" />
              </div>
            ) : (
              <div className="w-full">
                {orbits?.data?.orbits?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    {orbits?.data?.orbits.map((orbit: any) => (
                      <Card className="w-full" key={orbit._id}>
                        <CardContent className="flex items-center justify-between">
                          <div>
                            <Button
                              variant="link"
                              className="text-base p-0"
                              asChild
                            >
                              <Link href={`/${username}/orbits/${orbit.name}`}>
                                {orbit.name}
                              </Link>
                            </Button>
                            <p className="text-muted-foreground text-xs">
                              {formatDate(orbit.updatedAt)}
                            </p>
                          </div>

                          <Badge variant="secondary">{orbit.visibility}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="flex items-center justify-center min-w-full lg:min-h-73 p-0">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Orbit />
                        </EmptyMedia>
                        <EmptyTitle>No Orbits Yet</EmptyTitle>
                        <EmptyDescription>
                          {isOwner
                            ? "You haven't created any orbits yet. Get started by creating your first orbit."
                            : "This user hasn't created any orbits yet."}
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent className="flex-row justify-center gap-2">
                        {isOwner && (
                          <Button size="sm" asChild>
                            <Link href={`/${username}/create-orbit`}>
                              <Plus />
                              Create Orbit
                            </Link>
                          </Button>
                        )}
                      </EmptyContent>
                    </Empty>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* ORBITS PATH ------- */}
        {isOrbitsPath && (
          <div className="flex flex-col items-center w-full h-full pt-5 pb-20">
            {loading ? (
              <div className="flex items-center gap-5 justify-between w-full">
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-40 h-9" />
              </div>
            ) : (
              <div className="flex items-center gap-5 justify-between w-full">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search..."
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>
                {isOwner && (
                  <Button size="sm" asChild>
                    <Link href={`/${username}/create-orbit`}>
                      <Orbit />
                      Create Orbit
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {!loading && <Separator className="mt-5" />}

            {orbits?.data?.orbits?.length === 0 && (
              <Card className="flex items-center justify-center min-w-full lg:min-h-120 p-0 mt-5">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Orbit />
                    </EmptyMedia>
                    <EmptyTitle>No Orbits Yet</EmptyTitle>
                    <EmptyDescription>
                      {isOwner
                        ? "You haven't created any orbits yet. Get started by creating your first orbit."
                        : "This user hasn't created any orbits yet."}
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent className="flex-row justify-center gap-2">
                    {isOwner && (
                      <p className="text-muted-foreground">
                        Create your first orbit by clicking on the "Create
                        Orbit" button.
                      </p>
                    )}
                  </EmptyContent>
                </Empty>
              </Card>
            )}
            {loading ? (
              <div className="grid gap-4 w-full h-full mt-5">
                <Skeleton className="w-full shrink-0 h-28 rounded-xl" />
                <Skeleton className="w-full shrink-0 h-28 rounded-xl" />
                <Skeleton className="w-full shrink-0 h-28 rounded-xl" />
              </div>
            ) : (
              <div className="grid gap-4 w-full h-full">
                <div>
                  {orbits?.data?.orbits?.length > 0 &&
                  !filteredOrbits?.length ? (
                    <div className="lg:min-h-90 flex items-center justify-center">
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <SearchAlert />
                          </EmptyMedia>
                          <EmptyTitle>No Orbits Found</EmptyTitle>
                          <EmptyDescription>
                            Try adjusting your search keywords.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </div>
                  ) : (
                    <div className="w-full">
                      {filteredOrbits?.map((orbit: any) => (
                        <Card
                          className="w-full border-0 border-b rounded-none shadow-none"
                          key={orbit._id}
                        >
                          <CardContent className="flex items-center justify-between">
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="link"
                                  className="text-lg font-medium p-0"
                                  asChild
                                >
                                  <Link
                                    href={`/${username}/orbits/${orbit.name}`}
                                  >
                                    {orbit.name}
                                  </Link>
                                </Button>
                                <Badge variant="secondary">
                                  {orbit.visibility}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-xs">
                                {formatDate(orbit.updatedAt)}
                              </p>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {orbit.snapshots.length} snapshots
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
