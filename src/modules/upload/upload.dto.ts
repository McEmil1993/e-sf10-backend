import fs from "fs";
import path from "path";

import {
  getUploadCategoryByExtension,
  getUploadDirectoryByCategory,
  isUploadCategory,
  uploadCategories,
  uploadConfig,
  type UploadCategory,
} from "../../config/uploads";
import { HttpError } from "../../common/utils/http-error";
import type {
  StoredFileResponse,
  UploadConfigResponse,
  UploadFileListResponse,
  UploadedFileResponse,
} from "./upload.interface";

const uploadFileMimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".csv": "text/csv",
  ".sql": "application/sql",
  ".txt": "text/plain",
};

const buildRelativeUrl = (category: UploadCategory, filename: string): string => {
  return `${uploadConfig.publicPath}/${category}/${filename}`;
};

const buildApiViewUrl = (category: UploadCategory, filename: string): string => {
  return `/api/uploads/files/${category}/${filename}/view`;
};

const toIsoString = (value: Date): string => {
  return value.toISOString();
};

const sanitizeStoredFilename = (filename: string): string => {
  if (typeof filename !== "string" || filename.trim().length === 0) {
    throw new HttpError(400, "filename route parameter is required.");
  }

  const sanitizedValue = path.basename(filename.trim());

  if (sanitizedValue !== filename.trim()) {
    throw new HttpError(400, "filename contains an invalid path.");
  }

  return sanitizedValue;
};

const getMimeTypeByExtension = (extension: string): string => {
  return uploadFileMimeTypes[extension] ?? "application/octet-stream";
};

const getOriginalNameFromStoredFilename = (filename: string): string => {
  return filename.replace(/^\d+-[0-9a-f-]{36}-/i, "");
};

const toStoredFileResponse = (
  category: UploadCategory,
  filename: string,
  stats: fs.Stats,
  baseUrl: string,
): StoredFileResponse => {
  const extension = path.extname(filename).toLowerCase();
  const relativeUrl = buildRelativeUrl(category, filename);
  const apiViewUrl = buildApiViewUrl(category, filename);
  const storagePath = path.join(getUploadDirectoryByCategory(category), filename);

  return {
    category,
    originalName: getOriginalNameFromStoredFilename(filename),
    filename,
    mimeType: getMimeTypeByExtension(extension),
    extension,
    sizeInBytes: stats.size,
    relativeUrl,
    publicUrl: `${baseUrl}${relativeUrl}`,
    apiViewUrl: `${baseUrl}${apiViewUrl}`,
    storagePath,
    uploadedAt: toIsoString(stats.birthtime),
    lastModifiedAt: toIsoString(stats.mtime),
  };
};

export const parseUploadCategoryFilter = (value: unknown): UploadCategory | "all" => {
  if (value === undefined || value === null || value === "" || value === "all") {
    return "all";
  }

  if (Array.isArray(value) || typeof value !== "string" || !isUploadCategory(value)) {
    throw new HttpError(
      400,
      `category must be one of: all, ${uploadCategories.join(", ")}.`,
    );
  }

  return value;
};

export const parseUploadCategoryParam = (value: string | string[] | undefined): UploadCategory => {
  if (Array.isArray(value) || typeof value !== "string" || !isUploadCategory(value)) {
    throw new HttpError(400, `category must be one of: ${uploadCategories.join(", ")}.`);
  }

  return value;
};

export const parseUploadFilenameParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value) || typeof value !== "string") {
    throw new HttpError(400, "filename route parameter is required.");
  }

  return sanitizeStoredFilename(value);
};

export const toUploadedFileResponse = (
  file: Express.Multer.File,
  baseUrl: string,
): UploadedFileResponse => {
  const extension = path.extname(file.originalname).toLowerCase();
  const category = getUploadCategoryByExtension(extension);

  if (!category) {
    throw new HttpError(400, `Unsupported file type "${extension || file.originalname}".`);
  }

  const relativeUrl = buildRelativeUrl(category, file.filename);
  const apiViewUrl = buildApiViewUrl(category, file.filename);

  return {
    category,
    fieldName: file.fieldname,
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.mimetype,
    extension,
    sizeInBytes: file.size,
    relativeUrl,
    publicUrl: `${baseUrl}${relativeUrl}`,
    apiViewUrl: `${baseUrl}${apiViewUrl}`,
    storagePath: file.path,
  };
};

export const toStoredUploadListResponse = (
  category: UploadCategory | "all",
  files: StoredFileResponse[],
): UploadFileListResponse => {
  return {
    category,
    totalFiles: files.length,
    totalSizeInBytes: files.reduce((sum, file) => sum + file.sizeInBytes, 0),
    files,
  };
};

export const toUploadConfigResponse = (): UploadConfigResponse => {
  return {
    publicPath: uploadConfig.publicPath,
    maxFileSizeInBytes: uploadConfig.maxFileSizeInBytes,
    maxFilesPerRequest: uploadConfig.maxFilesPerRequest,
    allowedExtensions: [...uploadConfig.allowedExtensions],
    categoryDirectories: Object.fromEntries(
      Object.entries(uploadConfig.categoryDirectories).map(([category, directoryPath]) => {
        return [category, directoryPath];
      }),
    ),
    singleUploadFieldName: "file",
    multipleUploadFieldName: "files",
  };
};

export const toStoredUploadFileResponse = (
  category: UploadCategory,
  filename: string,
  stats: fs.Stats,
  baseUrl: string,
): StoredFileResponse => {
  return toStoredFileResponse(category, filename, stats, baseUrl);
};
