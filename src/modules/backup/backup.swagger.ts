import {
  bearerSecurity,
  createApiPath,
  createErrorResponse,
  createMultipartRequestBody,
  createSuccessResponse,
} from "../../docs/swagger.helpers";
import { backupConfig } from "../../config/backups";
import type { SwaggerModule } from "../../docs/swagger.types";

const unauthorizedResponse = createErrorResponse(
  "Missing or invalid token.",
  "Authentication token is missing or invalid.",
);

export const backupSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Backups",
      description: "Database backup export, download, and restore endpoints.",
    },
  ],
  schemas: {
    BackupFileItem: {
      type: "object",
      required: [
        "filename",
        "displayName",
        "extension",
        "sizeInBytes",
        "downloadUrl",
        "storagePath",
        "createdAt",
        "lastModifiedAt",
        "source",
      ],
      properties: {
        filename: { type: "string", example: "backup-20260427-103000-uuid.sql" },
        displayName: { type: "string", example: "backup-20260427-103000-uuid" },
        extension: { type: "string", example: ".sql" },
        sizeInBytes: { type: "integer", example: 4096 },
        downloadUrl: {
          type: "string",
          example: "http://localhost:5555/api/backups/files/backup-20260427-103000-uuid.sql/download",
        },
        storagePath: {
          type: "string",
          example: "C:/project/storage/backups/backup-20260427-103000-uuid.sql",
        },
        createdAt: { type: "string", format: "date-time" },
        lastModifiedAt: { type: "string", format: "date-time" },
        source: { type: "string", enum: ["export", "import"], example: "export" },
      },
    },
    BackupSummary: {
      type: "object",
      required: ["totalRecords", "tableCounts"],
      properties: {
        totalRecords: { type: "integer", example: 126 },
        tableCounts: {
          type: "object",
          additionalProperties: { type: "integer" },
          example: {
            modules: 4,
            permissions: 14,
            roles: 4,
            role_permissions: 38,
            positions: 6,
            users: 10,
            user_roles: 7,
            user_permissions: 2,
            pupils: 41,
          },
        },
      },
    },
    BackupListResponse: {
      type: "object",
      required: ["totalFiles", "totalSizeInBytes", "files"],
      properties: {
        totalFiles: { type: "integer", example: 3 },
        totalSizeInBytes: { type: "integer", example: 120560 },
        files: {
          type: "array",
          items: { $ref: "#/components/schemas/BackupFileItem" },
        },
      },
    },
    BackupMutationResponse: {
      type: "object",
      required: ["file", "summary"],
      properties: {
        file: { $ref: "#/components/schemas/BackupFileItem" },
        summary: { $ref: "#/components/schemas/BackupSummary" },
      },
    },
  },
  paths: {
    [createApiPath("/backups")]: {
      get: {
        tags: ["Backups"],
        summary: "List stored backup files",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse(
            "Backups fetched successfully.",
            "Backups fetched successfully.",
            { $ref: "#/components/schemas/BackupListResponse" },
          ),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/backups/export")]: {
      post: {
        tags: ["Backups"],
        summary: "Generate a fresh database backup",
        security: bearerSecurity,
        responses: {
          "201": createSuccessResponse(
            "Backup exported successfully.",
            "Backup exported successfully.",
            { $ref: "#/components/schemas/BackupMutationResponse" },
          ),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/backups/files/{filename}/download")]: {
      get: {
        tags: ["Backups"],
        summary: "Download a stored backup file",
        security: bearerSecurity,
        parameters: [
          {
            in: "path",
            name: "filename",
            required: true,
            schema: { type: "string", example: "backup-20260427-103000-uuid.sql" },
          },
        ],
        responses: {
          "200": {
            description: "The backup file content.",
          },
          "400": createErrorResponse("Invalid backup filename.", "Invalid backup filename."),
          "401": unauthorizedResponse,
          "404": createErrorResponse("Backup file not found.", "Backup file not found."),
        },
      },
    },
    [createApiPath("/backups/files/{filename}/import")]: {
      post: {
        tags: ["Backups"],
        summary: "Restore the database from a stored backup file",
        security: bearerSecurity,
        parameters: [
          {
            in: "path",
            name: "filename",
            required: true,
            schema: { type: "string", example: "backup-2026-4-27_11-00-33.sql" },
          },
        ],
        responses: {
          "201": createSuccessResponse(
            "Stored backup imported successfully.",
            "Stored backup imported successfully.",
            { $ref: "#/components/schemas/BackupMutationResponse" },
          ),
          "400": createErrorResponse("Invalid backup filename.", "Invalid backup filename."),
          "401": unauthorizedResponse,
          "404": createErrorResponse("Backup file not found.", "Backup file not found."),
        },
      },
    },
    [createApiPath("/backups/import")]: {
      post: {
        tags: ["Backups"],
        summary: "Upload and restore a database backup",
        security: bearerSecurity,
        requestBody: createMultipartRequestBody("Upload one backup file using the `file` field.", {
          type: "object",
          required: [backupConfig.uploadFieldName],
          properties: {
            [backupConfig.uploadFieldName]: {
              type: "string",
              format: "binary",
            },
          },
        }),
        responses: {
          "201": createSuccessResponse(
            "Backup imported successfully.",
            "Backup imported successfully.",
            { $ref: "#/components/schemas/BackupMutationResponse" },
          ),
          "400": createErrorResponse(
            "Validation or import error.",
            "Invalid backup file. Expected an E-SF10 MySQL SQL backup generated by this system.",
          ),
          "401": unauthorizedResponse,
        },
      },
    },
  },
};
