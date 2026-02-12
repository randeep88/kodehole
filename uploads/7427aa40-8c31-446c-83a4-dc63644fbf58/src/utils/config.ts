import fs from "fs";
import path from "path";

export type ProjectConfig = {
  projectId: string;
  createdAt: string;
};

export function loadConfig() {
  const configPath = path.join(process.cwd(), ".kodehole.json");

  if (!fs.existsSync(configPath)) {
    throw new Error(
      "❌ Project not initialized. Run `kdh init` first."
    );
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(raw) as ProjectConfig;
}
