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
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/src/hooks/useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export type FormValues = {
  name: string;
  email: string;
  username: string;
  password: string;
};

const RegisterPage = () => {
  const [eyeOpen, setEyeOpen] = useState(false);
  const { register: registerUser, isRegistering } = useUser();
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

  const handleRegister = async (data: FormValues) => {
    try {
      setUsername(data.username);
      registerUser(
        {
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
        },
        {
          onSuccess: () => {
            router.push("/login");
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your details below to register
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(handleRegister)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="credentials-name">Name</Label>
                <Input
                  aria-invalid={!!errors.name}
                  id="credentials-name"
                  type="text"
                  placeholder=""
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
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
                <Label htmlFor="credentials-email">Email</Label>
                <Input
                  aria-invalid={!!errors.email}
                  id="credentials-email"
                  type="email"
                  placeholder=""
                  {...register("email", {
                    required: "Email is required",
                  })}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
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
                      maxLength: {
                        value: 20,
                        message: "Password must be at most 20 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                      },
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
            <Button type="submit" className="w-full mt-6">
              {isRegistering ? "Registering..." : "Sign Up"}
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

export default RegisterPage;
