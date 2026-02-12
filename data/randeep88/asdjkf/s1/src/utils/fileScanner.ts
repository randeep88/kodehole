import fs from "fs";
import path from "path";
import { FileEntry } from "../types";

const IGNORE_LIST = [
  "node_modules",
  ".git",
  ".env",
  "dist",
  ".next"
];

export function scanFiles(
  currentDir: string,
  rootDir: string = currentDir,
  collected: FileEntry[] = []
): FileEntry[] {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORE_LIST.includes(entry.name)) continue;

    const fullPath = path.join(currentDir, entry.name);

    // 🔥 normalize path for zip (IMPORTANT)
    const relativePath = path
      .relative(rootDir, fullPath)
      .split(path.sep)
      .join("/");

    if (entry.isDirectory()) {
      scanFiles(fullPath, rootDir, collected);
    } else {
      collected.push({ fullPath, relativePath });
    }
  }

  return collected;
}
