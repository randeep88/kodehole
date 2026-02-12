import { getToken } from "../utils/config";
import chalk from "chalk";
import axios from "axios";
import { Command } from "commander";

export const createCommand = new Command("create")
  .argument("<orbit>", "Orbit name")
  .description("Create a new orbit")
  .action(async (orbit: string) => {
    console.log(chalk.cyan(`🚀 Creating orbit "${orbit}"...`));

    const token = getToken();

    if (!token) {
      console.log(chalk.red('❌ Please login first using "kdh login" command'));
      process.exit(1);
    }

    const res = await axios.post(
      `http://localhost:3000/api/orbits/create-orbit`,
      { name: orbit },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("✅ Orbit " + chalk.cyan(orbit) + " created");
  });
