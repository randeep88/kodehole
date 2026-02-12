import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/src/lib/db";
import CLIToken from "@/src/models/CLIToken";
import { auth } from "@/auth";

export async function POST() {
  await connectDB();

  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await CLIToken.create({
    user: session?.user?.id,
    token,
    expiresAt,
  });

  return NextResponse.json({ token });
}
