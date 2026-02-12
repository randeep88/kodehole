import fs from "fs";
import path from "path";

export type TreeNode = {
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
};

export function buildTree(dir: string): TreeNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.map((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return {
        name: entry.name,
        type: "folder",
        children: buildTree(fullPath),
      };
    }

    return {
      name: entry.name,
      type: "file",
    };
  });
}
