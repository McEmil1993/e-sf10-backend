import fs from "fs";
import path from "path";

import { UPLOAD_PUBLIC_PATH } from "./constants";

export const uploadCategoryByExtension = {
  ".jpg": "images",
  ".jpeg": "images",
  ".png": "images",
  ".gif": "images",
  ".webp": "images",
  ".svg": "images",
  ".pdf": "pdf",
  ".xls": "excel",
  ".xlsx": "excel",
  ".doc": "documents",
  ".docx": "documents",
  ".csv": "csv",
  ".sql": "sql",
  ".txt": "text",
} as const;

export type UploadExtension = keyof typeof uploadCategoryByExtension;
export type UploadCategory = (typeof uploadCategoryByExtension)[UploadExtension];

export const uploadCategories = Array.from(
  new Set<UploadCategory>(Object.values(uploadCategoryByExtension)),
);

const allowedUploadExtensions = Object.keys(uploadCategoryByExtension) as UploadExtension[];

export const uploadConfig = {
  directoryPath: path.resolve(process.cwd(), "storage", "uploads"),
  publicPath: UPLOAD_PUBLIC_PATH,
  maxFileSizeInBytes: 10 * 1024 * 1024,
  maxFilesPerRequest: 40,
  allowedExtensions: [...allowedUploadExtensions],
  categoryDirectories: uploadCategories.reduce<Record<UploadCategory, string>>((accumulator, category) => {
    accumulator[category] = path.join(path.resolve(process.cwd(), "storage", "uploads"), category);
    return accumulator;
  }, {} as Record<UploadCategory, string>),
} as const;

export const getUploadCategoryByExtension = (extension: string): UploadCategory | null => {
  return uploadCategoryByExtension[extension as UploadExtension] ?? null;
};

export const isUploadCategory = (value: string): value is UploadCategory => {
  return uploadCategories.includes(value as UploadCategory);
};

export const getUploadDirectoryByCategory = (category: UploadCategory): string => {
  return uploadConfig.categoryDirectories[category];
};

export const ensureUploadDirectory = (): void => {
  fs.mkdirSync(uploadConfig.directoryPath, { recursive: true });

  for (const category of uploadCategories) {
    fs.mkdirSync(getUploadDirectoryByCategory(category), { recursive: true });
  }
};
