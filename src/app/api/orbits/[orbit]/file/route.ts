import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { codeToHtml } from "shiki";
import { getUserFromRequest } from "@/src/lib/auth";
import { getOrbitPath } from "@/src/lib/storage";
import { auth } from "@/auth";

const LANG_MAP: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  json: "json",
  html: "html",
  css: "css",
  sh: "bash",
};

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
  const filePath = searchParams.get("path");
  const theme = searchParams.get("theme")!;

  if (!filePath) {
    return NextResponse.json({ error: "File path missing" }, { status: 400 });
  }

  const orbitPath = getOrbitPath(session?.user?.username, orbit);
  const snapshotsDir = path.join(orbitPath, snapshot);

  const fullPath = path.join(snapshotsDir, filePath);

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const code = fs.readFileSync(fullPath, "utf-8");
  const ext = filePath?.split(".").pop() || "txt";
  const lang = LANG_MAP[ext] || "text";

  const html = await codeToHtml(code, {
    lang,
    theme: `github-${theme}`,
  });

  return NextResponse.json({
    orbit,
    snapshot,
    path: filePath,
    html,
  });
}
