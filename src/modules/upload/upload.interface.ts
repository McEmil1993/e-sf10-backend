import type { UploadCategory } from "../../config/uploads";

export interface UploadedFileResponse {
  category: UploadCategory;
  fieldName: string;
  originalName: string;
  filename: string;
  mimeType: string;
  extension: string;
  sizeInBytes: number;
  relativeUrl: string;
  publicUrl: string;
  apiViewUrl: string;
  storagePath: string;
}

export interface StoredFileResponse {
  category: UploadCategory;
  originalName: string;
  filename: string;
  mimeType: string;
  extension: string;
  sizeInBytes: number;
  relativeUrl: string;
  publicUrl: string;
  apiViewUrl: string;
  storagePath: string;
  uploadedAt: string;
  lastModifiedAt: string;
}

export interface UploadFileListResponse {
  category: UploadCategory | "all";
  totalFiles: number;
  totalSizeInBytes: number;
  files: StoredFileResponse[];
}

export interface UploadConfigResponse {
  publicPath: string;
  maxFileSizeInBytes: number;
  maxFilesPerRequest: number;
  allowedExtensions: string[];
  categoryDirectories: Record<string, string>;
  singleUploadFieldName: string;
  multipleUploadFieldName: string;
}
