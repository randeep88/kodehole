import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getOrbitPath } from "@/src/lib/storage";
import { buildTree } from "@/src/lib/tree";
import { auth } from "@/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orbit: string }> },
) {
  const { orbit } = await params;
  const session = (await auth()) as any;

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const snapshot = searchParams.get("snapshot")!;

  const orbitPath = getOrbitPath(session?.user?.username, orbit);
  const snapshotPath = path.join(orbitPath, snapshot);

  if (!fs.existsSync(snapshotPath)) {
    return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
  }

  const tree = buildTree(snapshotPath);

  return NextResponse.json({ tree });
}
