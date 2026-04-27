import fs from "fs/promises";
import path from "path";

import {
  getUploadDirectoryByCategory,
  uploadCategories,
  type UploadCategory,
} from "../../config/uploads";
import { HttpError } from "../../common/utils/http-error";
import {
  toStoredUploadFileResponse,
  toStoredUploadListResponse,
  toUploadConfigResponse,
  toUploadedFileResponse,
} from "./upload.dto";

const ensureFileExists = async (filePath: string): Promise<void> => {
  try {
    await fs.access(filePath);
  } catch {
    throw new HttpError(404, "Uploaded file not found.");
  }
};

const getCategoryDirectory = (category: UploadCategory): string => {
  return getUploadDirectoryByCategory(category);
};

const getStorageFilePath = (category: UploadCategory, filename: string): string => {
  const categoryDirectory = getCategoryDirectory(category);
  const filePath = path.resolve(categoryDirectory, filename);

  if (!filePath.startsWith(path.resolve(categoryDirectory))) {
    throw new HttpError(400, "Invalid file path.");
  }

  return filePath;
};

const listCategoryFiles = async (
  category: UploadCategory,
  baseUrl: string,
) => {
  const directoryPath = getCategoryDirectory(category);
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const filePath = path.join(directoryPath, entry.name);
        const stats = await fs.stat(filePath);
        return toStoredUploadFileResponse(category, entry.name, stats, baseUrl);
      }),
  );

  return files.sort((left, right) => {
    return new Date(right.lastModifiedAt).getTime() - new Date(left.lastModifiedAt).getTime();
  });
};

export const uploadService = {
  getUploadConfig() {
    return toUploadConfigResponse();
  },

  getUploadedFile(file: Express.Multer.File, baseUrl: string) {
    return toUploadedFileResponse(file, baseUrl);
  },

  getUploadedFiles(files: Express.Multer.File[], baseUrl: string) {
    return files.map((file) => toUploadedFileResponse(file, baseUrl));
  },

  async listUploadedFiles(category: UploadCategory | "all", baseUrl: string) {
    const categories = category === "all" ? uploadCategories : [category];
    const listedFiles = await Promise.all(categories.map((item) => listCategoryFiles(item, baseUrl)));
    const files = listedFiles.flat().sort((left, right) => {
      return new Date(right.lastModifiedAt).getTime() - new Date(left.lastModifiedAt).getTime();
    });

    return toStoredUploadListResponse(category, files);
  },

  async getStoredFile(category: UploadCategory, filename: string, baseUrl: string) {
    const filePath = getStorageFilePath(category, filename);

    await ensureFileExists(filePath);

    const stats = await fs.stat(filePath);
    return toStoredUploadFileResponse(category, filename, stats, baseUrl);
  },

  async deleteStoredFile(category: UploadCategory, filename: string, baseUrl: string) {
    const filePath = getStorageFilePath(category, filename);

    await ensureFileExists(filePath);

    const file = await this.getStoredFile(category, filename, baseUrl);
    await fs.unlink(filePath);

    return file;
  },
};
