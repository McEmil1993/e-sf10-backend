import { randomUUID } from "crypto";
import path from "path";

import multer from "multer";

import {
  ensureUploadDirectory,
  getUploadCategoryByExtension,
  getUploadDirectoryByCategory,
  uploadConfig,
} from "../../config/uploads";
import { HttpError } from "../../common/utils/http-error";

const allowedExtensions = new Set<string>(uploadConfig.allowedExtensions);

const sanitizeBaseName = (filename: string): string => {
  const baseName = path.basename(filename, path.extname(filename));
  const sanitizedValue = baseName.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  return sanitizedValue.slice(0, 80) || "file";
};

const storage = multer.diskStorage({
  destination: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const category = getUploadCategoryByExtension(extension);

    if (!category) {
      callback(
        new HttpError(
          400,
          `Unsupported file type "${extension || file.originalname}". Allowed types: ${uploadConfig.allowedExtensions.join(", ")}`,
        ),
        "",
      );
      return;
    }

    ensureUploadDirectory();
    callback(null, getUploadDirectoryByCategory(category));
  },
  filename: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const fileName = `${Date.now()}-${randomUUID()}-${sanitizeBaseName(file.originalname)}${extension}`;

    callback(null, fileName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_request, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.has(extension)) {
    callback(
      new HttpError(
        400,
        `Unsupported file type "${extension || file.originalname}". Allowed types: ${uploadConfig.allowedExtensions.join(", ")}`,
      ),
    );
    return;
  }

  callback(null, true);
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSizeInBytes,
    files: uploadConfig.maxFilesPerRequest,
  },
});
