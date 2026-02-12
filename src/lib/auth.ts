import { NextRequest, NextResponse } from "next/server";
import CLIToken from "@/src/models/CLIToken";

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");

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

  return user;
}
