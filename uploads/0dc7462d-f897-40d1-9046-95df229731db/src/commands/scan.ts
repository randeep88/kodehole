import { scanFiles } from "../utils/fileScanner";

export default function scanCommand() {
  const cwd = process.cwd();
  const files = scanFiles(cwd);

  console.log(files);
}
