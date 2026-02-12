import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "data");

export function getOrbitPath(username: string, orbit: string) {
  return path.join(ROOT, username, orbit);
}

export function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getNextSnapshotId(snapshotsDir: string) {
  if (!fs.existsSync(snapshotsDir)) return "s1";

  const items = fs.readdirSync(snapshotsDir);
  return `s${items.length + 1}`;
}
