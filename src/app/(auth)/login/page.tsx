"use client";

import LoginWithGithub from "@/src/components/LoginWithGithub";
import LoginWithGoogle from "@/src/components/LoginWithGoogle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormValues = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [eyeOpen, setEyeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const { data: session, status } = useSession() as any;
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // @ts-ignore
      if (!session.user.usernameSet || session.user.isNewUser) {
        router.push(`/setup-username?email=${session.user?.email}`);
      } else {
        router.push(`/${session?.user?.username}`);
      }
    }
  }, [session, status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleLogin = async (data: FormValues) => {
    try {
      setLoading(true);
      setUsername(data.username);
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        if (result.error === "User not found") {
          toast.error("Username not found. Please check and try again.");
        } else if (result.error === "Invalid password") {
          toast.error("Incorrect password. Please try again.");
        } else if (result.error === "CredentialsSignin") {
          toast.error("Invalid username or password.");
        } else {
          toast.error(result.error || "Login failed. Please try again.");
        }
      } else if (result?.ok) {
        toast.success("Login successful!");
        router.push(`/${data.username}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(handleLogin)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="credentials-username">Username</Label>
                <Input
                  aria-invalid={!!errors.username}
                  id="credentials-username"
                  type="text"
                  placeholder=""
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
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="credentials-password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    aria-invalid={!!errors.password}
                    id="credentials-password"
                    type={eyeOpen ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      // pattern validation sirf signup page pe rakhein
                    })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => setEyeOpen(!eyeOpen)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-5"
                  >
                    {eyeOpen ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Logging in..." : "Login"}
            </Button>
            <Separator className="my-3" />
            <div className="w-full space-y-2">
              <LoginWithGoogle username={username} />
              <LoginWithGithub username={username} />
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
