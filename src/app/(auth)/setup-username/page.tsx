"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useUser } from "@/src/hooks/useUser";
import { useRouter, useSearchParams } from "next/navigation";

const SetupUsername = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const { udpateUsername, isUpdatingUsername } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!email) return;
    udpateUsername(
      { username: data.username, email },
      {
        onSuccess: () => {
          router.push(`/${data.username}`);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose your username</h1>
          <p className="text-muted-foreground">
            Pick a unique username for your profile
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              aria-invalid={!!errors.username}
              id="username"
              placeholder="yourusername"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Username must be at most 20 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Only letters, numbers, and underscores allowed",
                },
              })}
            />
            {errors.username && (
              <p className="text-sm text-red-500">
                {errors.username.message as string}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!!errors.username || isUpdatingUsername}
          >
            {isUpdatingUsername ? "Saving..." : "Save Username"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetupUsername;
