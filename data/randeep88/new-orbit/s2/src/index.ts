import { Command } from "commander";
import initCommand from "./commands/init";
import scanCommand from "./commands/scan";
import { loginCommand } from "./commands/login";
import pushCommand from "./commands/push";
import { createCommand } from "./commands/create";

const program = new Command();

program
  .name("kdh")
  .description("Kodehole CLI – simple project push tool")
  .version("0.0.1");

program.command("init").description("Initialize project").action(initCommand);

program.command("scan").description("Scan project files").action(scanCommand);

program.addCommand(loginCommand);
program.addCommand(createCommand);
program.addCommand(pushCommand);

program.parse(process.argv);
