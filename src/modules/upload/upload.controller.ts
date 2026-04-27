import path from "path";
import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import { HttpError } from "../../common/utils/http-error";
import {
  parseUploadCategoryFilter,
  parseUploadCategoryParam,
  parseUploadFilenameParam,
} from "./upload.dto";
import { uploadService } from "./upload.service";

const getBaseUrl = (request: Request): string => {
  return `${request.protocol}://${request.get("host")}`;
};

export const uploadController = {
  async getUploadConfig(_request: Request, response: Response): Promise<void> {
    const uploadOptions = uploadService.getUploadConfig();
    sendSuccess(response, 200, "Upload configuration fetched successfully.", uploadOptions);
  },

  async uploadSingle(request: Request, response: Response): Promise<void> {
    if (!request.file) {
      throw new HttpError(400, "No file uploaded. Use the \"file\" field.");
    }

    const uploadedFile = uploadService.getUploadedFile(request.file, getBaseUrl(request));
    sendSuccess(response, 201, "File uploaded successfully.", uploadedFile);
  },

  async uploadMultiple(request: Request, response: Response): Promise<void> {
    const files = Array.isArray(request.files) ? request.files : [];

    if (files.length === 0) {
      throw new HttpError(400, "No files uploaded. Use the \"files\" field.");
    }

    const uploadedFiles = uploadService.getUploadedFiles(files, getBaseUrl(request));
    sendSuccess(response, 201, "Files uploaded successfully.", uploadedFiles);
  },

  async listFiles(request: Request, response: Response): Promise<void> {
    const category = parseUploadCategoryFilter(request.query.category);
    const files = await uploadService.listUploadedFiles(category, getBaseUrl(request));
    sendSuccess(response, 200, "Uploaded files fetched successfully.", files);
  },

  async viewFile(request: Request, response: Response): Promise<void> {
    const category = parseUploadCategoryParam(request.params.category);
    const filename = parseUploadFilenameParam(request.params.filename);
    const file = await uploadService.getStoredFile(category, filename, getBaseUrl(request));

    response.setHeader("Content-Disposition", `inline; filename="${path.basename(file.originalName)}"`);
    response.sendFile(file.storagePath);
  },

  async deleteFile(request: Request, response: Response): Promise<void> {
    const category = parseUploadCategoryParam(request.params.category);
    const filename = parseUploadFilenameParam(request.params.filename);
    const deletedFile = await uploadService.deleteStoredFile(category, filename, getBaseUrl(request));
    sendSuccess(response, 200, "Uploaded file deleted successfully.", deletedFile);
  },
};
