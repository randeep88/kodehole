import { Command } from "commander";
import initCommand from "./commands/init";
import scanCommand from "./commands/scan";
import pushCommand from "./commands/push";

const program = new Command();

program
  .name("kdh")
  .description("Kodehole CLI – simple project push tool")
  .version("0.0.1");

program.command("init").description("Initialize project").action(initCommand);

program.command("scan").description("Scan project files").action(scanCommand);

program
  .command("push")
  .description("Push project to Kodehole")
  .action(pushCommand);

program.parse(process.argv);
