import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import chalk from "chalk";

import { loadLocalConfig, saveLocalConfig, getToken } from "../utils/config";
import { scanFiles } from "../utils/fileScanner";
import { createZip } from "../utils/zipper";
import Commander from "commander";
import inquirer from "inquirer";

const pushCommand = new Commander.Command("push")
  .argument("[orbit]", "Orbit name")
  .option("--force", "Relink orbit")
  .description("Push project into an orbit")
  .action(async (orbitArg: string | undefined, options: any) => {
    try {
      console.log(chalk.cyan("🚀 Starting Kodehole push..."));

      /* AUTH */
      const token = getToken();

      if (!token) {
        console.log(
          chalk.red('❌ Please login first using "kdh login" command'),
        );
        process.exit(1);
      }

      /* ORBIT RESOLUTION */
      const cwd = process.cwd();
      const localConfigPath = path.join(cwd, ".kodehole.json");

      let orbit = orbitArg;

      if (fs.existsSync(localConfigPath)) {
        const local = loadLocalConfig();

        if (!orbit) {
          orbit = local.orbit;
        } else if (orbit === local.orbit && !options.force) {
          console.log(
            chalk.yellow(`⚠️ Project already linked to orbit "${local.orbit}"`),
          );
          console.log(chalk.yellow("Use --force to relink"));
          process.exit(1);
        }
      }

      if (!orbit) {
        console.log(chalk.red("❌ Orbit name required on first push"));
        process.exit(1);
      }

      console.log(
        chalk.gray(`This project is linked to orbit:`) +
          " " +
          chalk.cyan(orbit),
      );

      console.log(
        chalk.gray(`To change orbit, run: `) +
          chalk.yellow(`kdh push <orbit-name>`) +
          "\n",
      );

      const { confirm } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm",
          message: `Push current project to orbit "${orbit}"?`,
          default: true,
        },
      ]);

      if (!confirm) {
        console.log(chalk.yellow("Push cancelled."));
        process.exit(0);
      }

      console.log(chalk.gray("🌍 Orbit:"), orbit);

      /* SCAN */
      console.log(chalk.cyan("🔍 Scanning files..."));
      const files = scanFiles(cwd);
      console.log(chalk.gray(`Found ${files.length} files`));

      /* ZIP */
      const zipPath = path.join(cwd, ".kodehole-upload.zip");

      console.log(chalk.cyan("📦 Creating zip..."));
      await createZip(files, zipPath);

      /* UPLOAD */
      console.log(chalk.yellow("☁️ Uploading snapshot..."));

      const form = new FormData();
      form.append("file", fs.createReadStream(zipPath));

      const res = await axios.post(
        `http://localhost:3000/api/orbits/${orbit}/snapshots`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
          maxBodyLength: Infinity,
        },
      );

      fs.unlinkSync(zipPath);
      saveLocalConfig({ orbit });

      console.log(chalk.green("✅ Snapshot created"));
      console.log(chalk.cyan("🔗", res.data.url));
    } catch (err: any) {
      console.error(chalk.red("❌ Push failed"));
      console.error(chalk.red(err.response.data.error));
      process.exit(1);
    }
  });

export default pushCommand;
