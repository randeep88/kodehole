import fs from "fs";
import path from "path";
import chalk from "chalk";

type ProjectConfig = {
  projectId: string;
  createdAt: string;
};

export default function initCommand() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, ".kodehole.json");

  if (fs.existsSync(configPath)) {
    console.log(chalk.yellow("⚠️ Project already initialized"));
    return;
  }

  const config: ProjectConfig = {
    projectId: Date.now().toString(),
    createdAt: new Date().toISOString()
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log(chalk.green("✅ Project initialized successfully"));
}
