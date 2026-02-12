"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, Orbit, Slash } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrbits } from "@/src/hooks/useOrbits";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/src/hooks/useUser";

export type orbit = {
  name: string;
  description: string;
  visibility: "Public" | "Private";
};

const CreateOrbitPage = () => {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<orbit>();

  const { user, isLoading } = useAuth();
  const { user: dbUser, isPending } = useUser(user?.username);

  const orbitName = watch("name");

  const { createOrbit, isCreatingOrbit, orbitExistense } = useOrbits(orbitName);

  const handleCreateOrbit = (data: orbit) => {
    createOrbit(data, {
      onSuccess: () => {
        router.push(`/${user?.username}/orbits/${data.name}`);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full pt-10 w-4xl mx-auto">
      <div className="mb-10 space-y-2 text-left mr-auto">
        <h1 className="text-xl text-left w-full font-medium">
          Create a new Orbit
        </h1>
        <p className="text-muted-foreground">
          An Orbit can contain multiple snapshots. Every time you push your
          code, a new snapshot is created. Each snapshot is permanently
          preserved and will never be replaced or overwritten.
        </p>
      </div>
      <form onSubmit={handleSubmit(handleCreateOrbit)} className="w-full">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 rounded-lg">
            {/* Owner Section */}
            <div className="shrink-0">
              <Label htmlFor="credentials-owner" className="text-sm mb-2 block">
                Owner
              </Label>
              <Badge
                variant="secondary"
                className="p-1 px-3 rounded-lg flex items-center gap-2 w-fit"
              >
                <Avatar className="w-7 h-7 border">
                  <AvatarImage src={user?.image!} />
                  <AvatarFallback className="">
                    {dbUser?.data.name?.split(" ")[0]?.[0]}
                    {dbUser?.data.name?.split(" ")[1]?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isLoading || isPending ? (
                  <Skeleton className="h-3 w-10 bg-primary/10" />
                ) : (
                  <p className="text-sm truncate max-w-[120px]">
                    {user?.username}
                  </p>
                )}
              </Badge>
            </div>

            {/* Separator */}
            <div className="flex items-center h-full pt-6">
              <Slash color="gray" className="-rotate-15" size={20} />
            </div>

            {/* Orbit Name Section */}
            <div className="flex-1 min-w-0">
              <Label htmlFor="credentials-name" className="text-sm mb-2 block">
                Orbit Name <span className="text-destructive">*</span>
              </Label>
              <Input
                disabled={isLoading || isPending}
                className="w-full"
                aria-invalid={!!errors.name}
                id="credentials-name"
                type="text"
                placeholder="Enter orbit name"
                {...register("name", {
                  required: "Name cannot be empty",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1.5">
                  {errors.name.message}
                </p>
              )}
              {orbitExistense?.data?.exists && (
                <p className="text-yellow-600 text-sm mt-1.5 flex items-center gap-1">
                  <span className="font-medium">"{orbitName}"</span> already
                  exists, try a different name.
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="credentials-description">Description</Label>
            <Input
              disabled={isLoading || isPending}
              aria-invalid={!!errors.description}
              id="credentials-description"
              className="w-full"
              type="text"
              placeholder=""
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid lg:grid-cols-2 w-full` gap-2">
            <Item variant="muted" className="w-4xl">
              <ItemContent>
                <ItemTitle>Choose visibility</ItemTitle>
                <ItemDescription>Choose who can see this orbit</ItemDescription>
              </ItemContent>
              <ItemActions>
                {isLoading || isPending ? (
                  <Skeleton className="shrink-0 h-9.5 w-[180px] rounded-lg" />
                ) : (
                  <Controller
                    name="visibility"
                    control={control}
                    defaultValue="Public"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Public">
                              <div className="flex items-center gap-2">
                                <Orbit className="w-4 h-4" />
                                <span>Public</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Private">
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span>Private</span>
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                )}
              </ItemActions>
            </Item>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          {isLoading || isPending ? (
            <Skeleton className="shrink-0 h-9.5 w-28 rounded-lg" />
          ) : (
            <Button
              type="submit"
              disabled={isCreatingOrbit || orbitExistense?.data?.exists}
            >
              {isCreatingOrbit && <Loader2 className="animate-spin" />}
              {isCreatingOrbit ? "Creating Orbit..." : "Create Orbit"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateOrbitPage;
