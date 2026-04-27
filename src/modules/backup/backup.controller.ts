import path from "path";
import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import { HttpError } from "../../common/utils/http-error";
import { backupConfig } from "../../config/backups";
import { parseBackupFilenameParam } from "./backup.dto";
import { backupService } from "./backup.service";

const getBaseUrl = (request: Request): string => {
  return `${request.protocol}://${request.get("host")}`;
};

export const backupController = {
  async listBackups(request: Request, response: Response): Promise<void> {
    const backups = await backupService.listBackups(getBaseUrl(request));
    sendSuccess(response, 200, "Backups fetched successfully.", backups);
  },

  async exportBackup(request: Request, response: Response): Promise<void> {
    const exportedBackup = await backupService.exportBackup(getBaseUrl(request));
    sendSuccess(response, 201, "Backup exported successfully.", exportedBackup);
  },

  async downloadBackup(request: Request, response: Response): Promise<void> {
    const filename = parseBackupFilenameParam(request.params.filename);
    const backupFile = await backupService.getBackupFile(filename, getBaseUrl(request));

    response.setHeader("Content-Type", "application/sql; charset=utf-8");
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(backupFile.filename)}"`,
    );
    response.sendFile(backupFile.storagePath);
  },

  async importStoredBackup(request: Request, response: Response): Promise<void> {
    const filename = parseBackupFilenameParam(request.params.filename);
    const importedBackup = await backupService.importBackupFromStorage(
      filename,
      getBaseUrl(request),
    );
    sendSuccess(response, 201, "Stored backup imported successfully.", importedBackup);
  },

  async importBackup(request: Request, response: Response): Promise<void> {
    if (!request.file) {
      throw new HttpError(400, `No backup file uploaded. Use the "${backupConfig.uploadFieldName}" field.`);
    }

    const importedBackup = await backupService.importBackupFromFile(
      request.file,
      getBaseUrl(request),
    );
    sendSuccess(response, 201, "Backup imported successfully.", importedBackup);
  },
};
