import connectDB from "@/src/lib/db";
import User from "@/src/models/User";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const url = req.nextUrl.searchParams;
  await connectDB();

  const username = url.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username not provided" },
      { status: 400 },
    );
  }

  const user = await User.findOne({ username });

  const loginProvider = user?.provider;

  return NextResponse.json({ provider: loginProvider });
};
