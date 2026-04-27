import {
  bearerSecurity,
  createApiPath,
  createErrorResponse,
  createMultipartRequestBody,
  createSuccessResponse,
} from "../../docs/swagger.helpers";
import { uploadCategories, uploadConfig } from "../../config/uploads";
import type { SwaggerModule } from "../../docs/swagger.types";

const unauthorizedResponse = createErrorResponse(
  "Missing or invalid token.",
  "Authentication token is missing or invalid.",
);

const uploadCategorySchema = {
  type: "string",
  enum: uploadCategories,
  example: "sql",
};

export const uploadSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Uploads",
      description: "Protected file upload, browsing, viewing, and storage management endpoints.",
    },
  ],
  schemas: {
    UploadConfigResponse: {
      type: "object",
      required: [
        "categoryDirectories",
        "publicPath",
        "maxFileSizeInBytes",
        "maxFilesPerRequest",
        "allowedExtensions",
        "singleUploadFieldName",
        "multipleUploadFieldName",
      ],
      properties: {
        publicPath: { type: "string", example: "/uploads" },
        maxFileSizeInBytes: { type: "integer", example: uploadConfig.maxFileSizeInBytes },
        maxFilesPerRequest: { type: "integer", example: uploadConfig.maxFilesPerRequest },
        allowedExtensions: {
          type: "array",
          items: { type: "string" },
          example: uploadConfig.allowedExtensions,
        },
        categoryDirectories: {
          type: "object",
          additionalProperties: { type: "string" },
          example: {
            images: "C:/project/storage/uploads/images",
            pdf: "C:/project/storage/uploads/pdf",
            excel: "C:/project/storage/uploads/excel",
            sql: "C:/project/storage/uploads/sql",
            csv: "C:/project/storage/uploads/csv",
            text: "C:/project/storage/uploads/text",
            documents: "C:/project/storage/uploads/documents",
          },
        },
        singleUploadFieldName: { type: "string", example: "file" },
        multipleUploadFieldName: { type: "string", example: "files" },
      },
    },
    UploadedFileResponse: {
      type: "object",
      required: [
        "category",
        "fieldName",
        "originalName",
        "filename",
        "mimeType",
        "extension",
        "sizeInBytes",
        "relativeUrl",
        "publicUrl",
        "apiViewUrl",
        "storagePath",
      ],
      properties: {
        category: { ...uploadCategorySchema },
        fieldName: { type: "string", example: "file" },
        originalName: { type: "string", example: "sample.sql" },
        filename: { type: "string", example: "1713510000000-uuid-sample.sql" },
        mimeType: { type: "string", example: "application/sql" },
        extension: { type: "string", example: ".sql" },
        sizeInBytes: { type: "integer", example: 24567 },
        relativeUrl: { type: "string", example: "/uploads/sql/1713510000000-uuid-sample.sql" },
        publicUrl: {
          type: "string",
          example: "http://localhost:5555/uploads/sql/1713510000000-uuid-sample.sql",
        },
        apiViewUrl: {
          type: "string",
          example: "http://localhost:5555/api/uploads/files/sql/1713510000000-uuid-sample.sql/view",
        },
        storagePath: {
          type: "string",
          example: "C:/project/storage/uploads/sql/1713510000000-uuid-sample.sql",
        },
      },
    },
    StoredFileResponse: {
      type: "object",
      required: [
        "category",
        "originalName",
        "filename",
        "mimeType",
        "extension",
        "sizeInBytes",
        "relativeUrl",
        "publicUrl",
        "apiViewUrl",
        "storagePath",
        "uploadedAt",
        "lastModifiedAt",
      ],
      properties: {
        category: { ...uploadCategorySchema },
        originalName: { type: "string", example: "backend-v2-upload-sample.sql" },
        filename: { type: "string", example: "1776565428981-uuid-backend-v2-upload-sample.sql" },
        mimeType: { type: "string", example: "application/sql" },
        extension: { type: "string", example: ".sql" },
        sizeInBytes: { type: "integer", example: 1024 },
        relativeUrl: {
          type: "string",
          example: "/uploads/sql/1776565428981-uuid-backend-v2-upload-sample.sql",
        },
        publicUrl: {
          type: "string",
          example: "http://localhost:5555/uploads/sql/1776565428981-uuid-backend-v2-upload-sample.sql",
        },
        apiViewUrl: {
          type: "string",
          example: "http://localhost:5555/api/uploads/files/sql/1776565428981-uuid-backend-v2-upload-sample.sql/view",
        },
        storagePath: {
          type: "string",
          example: "C:/project/storage/uploads/sql/1776565428981-uuid-backend-v2-upload-sample.sql",
        },
        uploadedAt: { type: "string", format: "date-time", example: "2026-04-19T11:00:00.000Z" },
        lastModifiedAt: { type: "string", format: "date-time", example: "2026-04-19T11:00:00.000Z" },
      },
    },
    UploadFileListResponse: {
      type: "object",
      required: ["category", "totalFiles", "totalSizeInBytes", "files"],
      properties: {
        category: {
          type: "string",
          enum: ["all", ...uploadCategories],
          example: "sql",
        },
        totalFiles: { type: "integer", example: 2 },
        totalSizeInBytes: { type: "integer", example: 5024 },
        files: {
          type: "array",
          items: {
            $ref: "#/components/schemas/StoredFileResponse",
          },
        },
      },
    },
  },
  paths: {
    [createApiPath("/uploads/config")]: {
      get: {
        tags: ["Uploads"],
        summary: "Get upload configuration",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse(
            "Upload config fetched successfully.",
            "Upload configuration fetched successfully.",
            { $ref: "#/components/schemas/UploadConfigResponse" },
          ),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/uploads/files")]: {
      get: {
        tags: ["Uploads"],
        summary: "List uploaded files",
        security: bearerSecurity,
        parameters: [
          {
            in: "query",
            name: "category",
            required: false,
            description: "Filter files by category. Leave empty or use `all` to show everything.",
            schema: {
              type: "string",
              enum: ["all", ...uploadCategories],
              example: "sql",
            },
          },
        ],
        responses: {
          "200": createSuccessResponse(
            "Uploaded files fetched successfully.",
            "Uploaded files fetched successfully.",
            { $ref: "#/components/schemas/UploadFileListResponse" },
          ),
          "400": createErrorResponse(
            "Invalid category filter.",
            `category must be one of: all, ${uploadCategories.join(", ")}.`,
          ),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/uploads/files/{category}/{filename}/view")]: {
      get: {
        tags: ["Uploads"],
        summary: "View an uploaded file through protected API",
        security: bearerSecurity,
        parameters: [
          {
            in: "path",
            name: "category",
            required: true,
            schema: uploadCategorySchema,
          },
          {
            in: "path",
            name: "filename",
            required: true,
            schema: { type: "string", example: "1776565428981-uuid-backend-v2-upload-sample.sql" },
          },
        ],
        responses: {
          "200": {
            description: "The uploaded file content.",
          },
          "400": createErrorResponse("Invalid path.", "filename contains an invalid path."),
          "401": unauthorizedResponse,
          "404": createErrorResponse("Uploaded file not found.", "Uploaded file not found."),
        },
      },
    },
    [createApiPath("/uploads/files/{category}/{filename}")]: {
      delete: {
        tags: ["Uploads"],
        summary: "Delete an uploaded file",
        security: bearerSecurity,
        parameters: [
          {
            in: "path",
            name: "category",
            required: true,
            schema: uploadCategorySchema,
          },
          {
            in: "path",
            name: "filename",
            required: true,
            schema: { type: "string", example: "1776565428981-uuid-backend-v2-upload-sample.sql" },
          },
        ],
        responses: {
          "200": createSuccessResponse(
            "Uploaded file deleted successfully.",
            "Uploaded file deleted successfully.",
            { $ref: "#/components/schemas/StoredFileResponse" },
          ),
          "400": createErrorResponse("Invalid path.", "filename contains an invalid path."),
          "401": unauthorizedResponse,
          "404": createErrorResponse("Uploaded file not found.", "Uploaded file not found."),
        },
      },
    },
    [createApiPath("/uploads/single")]: {
      post: {
        tags: ["Uploads"],
        summary: "Upload a single file",
        security: bearerSecurity,
        requestBody: createMultipartRequestBody("Upload one file using the `file` field.", {
          type: "object",
          required: ["file"],
          properties: {
            file: {
              type: "string",
              format: "binary",
            },
          },
        }),
        responses: {
          "201": createSuccessResponse(
            "File uploaded successfully.",
            "File uploaded successfully.",
            { $ref: "#/components/schemas/UploadedFileResponse" },
          ),
          "400": createErrorResponse(
            "Validation or upload error.",
            "Unsupported file type \".exe\". Allowed types: .jpg, .jpeg, .png, .gif, .webp, .svg, .pdf, .xls, .xlsx, .doc, .docx, .csv, .sql, .txt",
          ),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/uploads/multiple")]: {
      post: {
        tags: ["Uploads"],
        summary: "Upload multiple files",
        security: bearerSecurity,
        requestBody: createMultipartRequestBody("Upload multiple files using the `files` field.", {
          type: "object",
          required: ["files"],
          properties: {
            files: {
              type: "array",
              items: {
                type: "string",
                format: "binary",
              },
            },
          },
        }),
        responses: {
          "201": createSuccessResponse(
            "Files uploaded successfully.",
            "Files uploaded successfully.",
            {
              type: "array",
              items: {
                $ref: "#/components/schemas/UploadedFileResponse",
              },
            },
          ),
          "400": createErrorResponse(
            "Validation or upload error.",
            "Too many files. Maximum is 40 files per request.",
          ),
          "401": unauthorizedResponse,
        },
      },
    },
  },
};
