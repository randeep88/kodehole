import fs from "fs";
import path from "path";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

export function readDirectory(dir: string): FileNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.map((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return {
        name: entry.name,
        type: "folder",
        children: readDirectory(fullPath),
      };
    }

    return {
      name: entry.name,
      type: "file",
    };
  });
}
