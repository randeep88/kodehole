import fs from "fs";
import archiver from "archiver";
import { FileEntry } from "../types";

/**
 * Creates a zip file from given files
 */
export function createZip(
  files: FileEntry[],
  outputPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // max compression
    });

    // when zip is fully written
    output.on("close", () => {
      resolve();
    });

    archive.on("error", (err) => {
      reject(err);
    });

    archive.pipe(output);

    for (const file of files) {
      archive.file(file.fullPath, {
        name: file.relativePath,
      });
    }

    archive.finalize();
  });
}
