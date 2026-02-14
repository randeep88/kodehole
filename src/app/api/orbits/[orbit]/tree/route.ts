import { NextRequest, NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "@/src/lib/r2";
import { auth } from "@/auth";

interface TreeNode {
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

function buildTreeFromKeys(keys: string[], prefix: string): TreeNode[] {
  const tree: Record<string, any> = {};

  for (const key of keys) {
    const relative = key.replace(prefix, "");

    // Skip empty keys
    if (!relative) continue;

    const parts = relative.split("/").filter(Boolean);

    let current = tree;

    parts.forEach((part, index) => {
      const isLastPart = index === parts.length - 1;

      if (!current[part]) {
        current[part] = isLastPart
          ? { type: "file" }
          : { type: "folder", children: {} };
      }

      // Navigate deeper if it's a folder
      if (current[part].children) {
        current = current[part].children;
      }
    });
  }

  const formatTree = (node: Record<string, any>): TreeNode[] => {
    return Object.entries(node).map(([name, value]) => ({
      name,
      type: value.type as "file" | "folder",
      ...(value.children && { children: formatTree(value.children) }),
    }));
  };

  return formatTree(tree);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orbit: string }> },
) {
  try {
    const session = (await auth()) as any;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orbit } = await params;
    const { searchParams } = new URL(req.url);
    const snapshotName = searchParams.get("snapshot");

    if (!snapshotName) {
      return NextResponse.json(
        { error: "Snapshot parameter required" },
        { status: 400 },
      );
    }

    const prefix = `${session.user.username}/${orbit}/${snapshotName}/`;

    const result = await r2.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: prefix,
      }),
    );

    // Handle empty or no contents
    if (!result.Contents || result.Contents.length === 0) {
      return NextResponse.json({ tree: [] });
    }

    const keys = result.Contents.map((obj) => obj.Key!).filter(Boolean);

    const tree = buildTreeFromKeys(keys, prefix);

    return NextResponse.json({ tree });
  } catch (error) {
    console.error("Error fetching snapshot tree:", error);
    return NextResponse.json(
      { error: "Failed to fetch snapshot tree" },
      { status: 500 },
    );
  }
}
