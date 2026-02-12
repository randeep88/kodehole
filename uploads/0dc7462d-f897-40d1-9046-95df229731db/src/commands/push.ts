import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import chalk from "chalk";

import { loadConfig } from "../utils/config";
import { scanFiles } from "../utils/fileScanner";
import { createZip } from "../utils/zipper";

export default async function pushCommand() {
  try {
    console.log(chalk.cyan("🚀 Started pushing to Kodehole..."));

    // 1️⃣ Validate project
    const config = loadConfig();
    console.log(chalk.gray("Project ID:"), config.projectId);

    // 2️⃣ Scan files
    const cwd = process.cwd();
    const files = scanFiles(cwd);

    console.log(chalk.gray(`Found ${files.length} files`));

    // 3️⃣ Create zip
    const zipPath = path.join(cwd, ".kodehole-upload.zip");

    console.log(chalk.cyan("📦 Creating zip..."));
    await createZip(files, zipPath);

    // 4️⃣ Upload zip
    console.log(chalk.yellow("☁️", "", " Uploading to Kodehole..."));

    const form = new FormData();
    form.append("file", fs.createReadStream(zipPath));

    const res = await axios.post("http://localhost:3000/api/push", form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    // 5️⃣ Cleanup
    fs.unlinkSync(zipPath);

    console.log(chalk.green("✅ Push successful"));
    console.log(chalk.cyan("🔗", res.data.url));
  } catch (err: any) {
    console.error(chalk.red("❌ Push failed"));
    console.error(chalk.red(err.message));
  }
}
