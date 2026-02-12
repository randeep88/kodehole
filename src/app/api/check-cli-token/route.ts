import connectDB from "@/src/lib/db";
import CLIToken from "@/src/models/CLIToken";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { token } = await req.json();
  await connectDB();

  const cliToken = await CLIToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  }).populate("user");

  if (!cliToken) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  const user = cliToken.user;

  return NextResponse.json(user);
};
