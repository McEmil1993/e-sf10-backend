import path from "path";
import type { Stats } from "fs";

import { HttpError } from "../../common/utils/http-error";
import type {
  BackupFileItem,
  BackupListResponse,
  BackupSummary,
  BackupTableName,
} from "./backup.interface";

const backupFilenamePattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.sql$/;

export const parseBackupFilenameParam = (value: unknown): string => {
  if (typeof value !== "string" || !backupFilenamePattern.test(value)) {
    throw new HttpError(400, "Invalid backup filename.");
  }

  return value;
};

export const toBackupFileItem = (
  filename: string,
  stats: Stats,
  baseUrl: string,
  storagePath: string,
): BackupFileItem => {
  const source = filename.startsWith("imported-") ? "import" : "export";

  return {
    filename,
    displayName: path.basename(filename, path.extname(filename)),
    extension: path.extname(filename).toLowerCase(),
    sizeInBytes: stats.size,
    downloadUrl: `${baseUrl}/api/backups/files/${encodeURIComponent(filename)}/download`,
    storagePath,
    createdAt: stats.birthtime.toISOString(),
    lastModifiedAt: stats.mtime.toISOString(),
    source,
  };
};

export const toBackupListResponse = (files: BackupFileItem[]): BackupListResponse => {
  return {
    totalFiles: files.length,
    totalSizeInBytes: files.reduce((totalSize, file) => totalSize + file.sizeInBytes, 0),
    files,
  };
};

export const toBackupSummary = (tableCounts: Record<BackupTableName, number>): BackupSummary => {
  return {
    totalRecords: Object.values(tableCounts).reduce((total, count) => total + count, 0),
    tableCounts,
  };
};
