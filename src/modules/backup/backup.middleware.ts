import path from "path";

import multer from "multer";

import { backupConfig } from "../../config/backups";
import { HttpError } from "../../common/utils/http-error";

const allowedExtensions = new Set<string>(backupConfig.allowedExtensions);

const fileFilter: multer.Options["fileFilter"] = (_request, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.has(extension)) {
    callback(
      new HttpError(
        400,
        `Unsupported backup file type "${extension || file.originalname}". Allowed types: ${backupConfig.allowedExtensions.join(", ")}`,
      ),
    );
    return;
  }

  callback(null, true);
};

export const backupUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: backupConfig.maxFileSizeInBytes,
    files: 1,
  },
});
