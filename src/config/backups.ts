import fs from "fs";
import path from "path";

const storageRoot = path.resolve(process.cwd(), "storage");

export const backupConfig = {
  directoryPath: path.join(storageRoot, "backups"),
  maxFileSizeInBytes: 25 * 1024 * 1024,
  allowedExtensions: [".sql"],
  uploadFieldName: "file",
} as const;

export const ensureBackupDirectory = (): void => {
  fs.mkdirSync(backupConfig.directoryPath, { recursive: true });
};
