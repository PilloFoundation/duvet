import fs from "fs";
import path from "path";

/**
 * Gets the contents of a directory, partitioned into files and directories.
 * @param directory The path to the directory to get the contents of.
 * @returns An object containing the files and directories in the directory.
 */
export function getDirectoryContents(directory: string): {
  files: string[];
  directories: string[];
} {
  const directoryContents = fs.readdirSync(directory);
  const files: string[] = [];
  const directories: string[] = [];

  for (const currentFileName of directoryContents) {
    const absolutePathToCurrentFile = path.join(directory, currentFileName);
    const stat = fs.statSync(absolutePathToCurrentFile);

    if (stat.isDirectory()) {
      directories.push(currentFileName);
    } else {
      files.push(currentFileName);
    }
  }

  return {
    files,
    directories,
  };
}
