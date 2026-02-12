import { Command } from "commander";
import { saveToken } from "../utils/config";
import axios from "axios";
import inquirer from "inquirer";
import chalk from "chalk";

export const loginCommand = new Command("login")
  .description("Login to Kodehole")
  .action(async () => {
    try {
      console.log(chalk.cyan("🔐 Login to Kodehole\n"));

      const { username } = await inquirer.prompt([
        {
          type: "input",
          name: "username",
          message: "Username:",
        },
      ]);

      console.log(chalk.cyan("Checking login provider...\n"));

      const checkRes = await axios.get(
        `http://localhost:3000/api/check-login-provider?username=${username}`,
      );

      const loginProvider = checkRes.data.provider;

      if (loginProvider === "credentials") {
        const { password } = await inquirer.prompt([
          {
            type: "password",
            name: "password",
            message: "Password:",
            mask: "*",
          },
        ]);
        const res = await axios.post("http://localhost:3000/api/cli-login", {
          username,
          password,
        });

        saveToken(res.data.token);
        console.log(chalk.green("\n✅ Login successful"));
      } else {
        const { token } = await inquirer.prompt([
          {
            type: "password",
            name: "token",
            message: "Paste your CLI token:",
            mask: "*",
          },
        ]);

        const res = await axios.post(
          "http://localhost:3000/api/check-cli-token",
          {
            token,
          },
        );

        saveToken(token);
        console.log(chalk.green("\n✅ Login successful"));
      }
    } catch (err: any) {
      console.error(chalk.red(err.response?.data?.error || "❌ Login failed"));
      process.exit(1);
    }
  });
