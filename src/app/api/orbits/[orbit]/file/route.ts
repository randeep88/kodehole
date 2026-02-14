import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/src/lib/r2";
import { codeToHtml } from "shiki";
import { auth } from "@/auth";
import Snapshot from "@/src/models/Snapshot";
import connectDB from "@/src/lib/db";

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
  await connectDB();

  const session = (await auth()) as any;
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orbit } = await params;
  const { searchParams } = new URL(req.url);

  const snapshotName = searchParams.get("snapshot");
  const filePath = searchParams.get("path");
  const theme = searchParams.get("theme") || "dark";

  if (!snapshotName || !filePath) {
    return NextResponse.json(
      { error: "Missing snapshot or file path" },
      { status: 400 },
    );
  }

  const snapshot = await Snapshot.findOne({
    index: Number(snapshotName.replace("s", "")),
  });

  if (!snapshot) {
    return NextResponse.json({ error: "Snapshot not found" }, { status: 404 });
  }

  const key = `${session.user.username}/${orbit}/${snapshotName}/${filePath}`;

  const object = await r2.send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    }),
  );

  const stream = object.Body as any;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const code = Buffer.concat(chunks).toString("utf-8");

  const ext = filePath.split(".").pop() || "txt";
  const lang = LANG_MAP[ext] || "text";

  const html = await codeToHtml(code, {
    lang,
    theme: `github-${theme}`,
  });

  return NextResponse.json({
    orbit,
    snapshot: snapshotName,
    path: filePath,
    html,
  });
}
