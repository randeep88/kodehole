import fs from "fs";
import path from "path";
import os from "os";

const GLOBAL_DIR = path.join(os.homedir(), ".kodehole");
const GLOBAL_FILE = path.join(GLOBAL_DIR, "config.json");
const LOCAL_FILE = path.join(process.cwd(), ".kodehole.json");

/* GLOBAL TOKEN */
export function saveToken(token: string) {
  if (!fs.existsSync(GLOBAL_DIR)) {
    fs.mkdirSync(GLOBAL_DIR);
  }
  fs.writeFileSync(
    GLOBAL_FILE,
    JSON.stringify({ token }, null, 2)
  );
}

export function getToken(): string | null {
  if (!fs.existsSync(GLOBAL_FILE)) return null;
  return JSON.parse(
    fs.readFileSync(GLOBAL_FILE, "utf-8")
  ).token;
}

/* LOCAL ORBIT */
export function loadLocalConfig(): { orbit: string } {
  return JSON.parse(
    fs.readFileSync(LOCAL_FILE, "utf-8")
  );
}

export function saveLocalConfig(data: { orbit: string }) {
  fs.writeFileSync(
    LOCAL_FILE,
    JSON.stringify(data, null, 2)
  );
}
