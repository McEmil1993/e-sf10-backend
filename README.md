# Backend Steps: Add a New Module or API Endpoint

Guide ito para magdagdag ng bagong backend module sa current system.
Ang backend stack ngayon ay:

- Express + TypeScript
- MySQL via `mysql2`
- Module structure under `src/modules`
- Central route registration in `src/modules/index.ts`
- API prefix: `/api`
- Swagger docs: `/docs` and `/docs.json`
- Database bootstrap/migrations: `src/config/db.ts`

Example module sa guide: `announcements`.
Palitan lang ang pangalan kung ibang module ang gagawin mo.

## 1. Planuhin muna ang endpoint

Example target endpoints:

```txt
GET    /api/announcements
POST   /api/announcements
GET    /api/announcements/:id
PUT    /api/announcements/:id
DELETE /api/announcements/:id
```

Default response format sa backend:

```json
{
  "success": true,
  "message": "Announcements fetched successfully.",
  "data": []
}
```

Errors should use `HttpError` para dumaan sa global error middleware.

## 2. Create the module folder

Create this folder:

```txt
src/modules/announcement/
```

Recommended files:

```txt
src/modules/announcement/announcement.interface.ts
src/modules/announcement/announcement.dto.ts
src/modules/announcement/announcement.repository.ts
src/modules/announcement/announcement.service.ts
src/modules/announcement/announcement.controller.ts
src/modules/announcement/announcement.routes.ts
src/modules/announcement/announcement.swagger.ts
src/modules/announcement/index.ts
```

## 3. Add the database table

Open:

```txt
src/config/db.ts
```

Add a table SQL constant near the other `create...TableSql` constants:

```ts
const createAnnouncementsTableSql = `
  CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id),
    KEY idx_announcements_deleted_at (deleted_at),
    KEY idx_announcements_is_active (is_active)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;
```

Then register it inside `initializeDatabase()`:

```ts
await db.execute(createAnnouncementsTableSql);
```

Place it with the other `await db.execute(create...TableSql)` calls.

If you are adding columns to an existing table, use the existing helper pattern:

```ts
const ensureAnnouncementsTableShape = async (): Promise<void> => {
  if (!(await hasColumn("announcements", "is_active"))) {
    await db.execute(
      "ALTER TABLE announcements ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER body",
    );
  }
};
```

Then call it in `initializeDatabase()` after the table is created:

```ts
await ensureAnnouncementsTableShape();
```

## 4. Define TypeScript interfaces

Create:

```txt
src/modules/announcement/announcement.interface.ts
```

Code:

```ts
import type { RowDataPacket } from "mysql2";

export interface AnnouncementBaseFields {
  title: string;
  body: string;
  isActive: boolean;
}

export interface AnnouncementRecord extends AnnouncementBaseFields {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export interface CreateAnnouncementInput extends AnnouncementBaseFields {}

export interface UpdateAnnouncementInput extends AnnouncementBaseFields {}

export interface CreateAnnouncementDto extends AnnouncementBaseFields {}

export interface UpdateAnnouncementDto {
  title?: string;
  body?: string;
  isActive?: boolean;
}

export interface AnnouncementResponseDto extends AnnouncementBaseFields {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AnnouncementRow extends RowDataPacket {
  id: number;
  title: string;
  body: string;
  isActive: number | boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}
```

## 5. Add DTO parsing and response mapping

Create:

```txt
src/modules/announcement/announcement.dto.ts
```

Code:

```ts
import { HttpError } from "../../common/utils/http-error";
import type {
  AnnouncementRecord,
  AnnouncementResponseDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from "./announcement.interface";

const toIsoString = (value: Date | string): string => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
};

const toNullableIsoString = (value: Date | string | null): string | null => {
  if (!value) {
    return null;
  }

  return toIsoString(value);
};

const getBodyObject = (payload: unknown): Record<string, unknown> => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new HttpError(400, "Request body must be a valid JSON object.");
  }

  return payload as Record<string, unknown>;
};

const getRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is required.`);
  }

  return value.trim();
};

const getOptionalRequiredString = (value: unknown, fieldName: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} must be a non-empty string.`);
  }

  return value.trim();
};

const getBoolean = (value: unknown, fieldName: string, fallback: boolean): boolean => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }

    if (value === "false") {
      return false;
    }
  }

  throw new HttpError(400, `${fieldName} must be a boolean.`);
};

export const parseAnnouncementIdParam = (
  value: string | string[] | undefined,
  fieldName = "id",
): number => {
  if (Array.isArray(value)) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new HttpError(400, `${fieldName} must be a valid positive integer.`);
  }

  return parsedValue;
};

export const parseCreateAnnouncementDto = (payload: unknown): CreateAnnouncementDto => {
  const body = getBodyObject(payload);

  return {
    title: getRequiredString(body.title, "title"),
    body: getRequiredString(body.body, "body"),
    isActive: getBoolean(body.isActive, "isActive", true),
  };
};

export const parseUpdateAnnouncementDto = (payload: unknown): UpdateAnnouncementDto => {
  const body = getBodyObject(payload);
  const updatePayload: UpdateAnnouncementDto = {};

  if ("title" in body) {
    updatePayload.title = getOptionalRequiredString(body.title, "title");
  }

  if ("body" in body) {
    updatePayload.body = getOptionalRequiredString(body.body, "body");
  }

  if ("isActive" in body) {
    updatePayload.isActive = getBoolean(body.isActive, "isActive", true);
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new HttpError(400, "At least one field is required for update.");
  }

  return updatePayload;
};

export const toAnnouncementResponseDto = (
  announcement: AnnouncementRecord,
): AnnouncementResponseDto => {
  return {
    id: announcement.id,
    title: announcement.title,
    body: announcement.body,
    isActive: announcement.isActive,
    createdAt: toIsoString(announcement.createdAt),
    updatedAt: toIsoString(announcement.updatedAt),
    deletedAt: toNullableIsoString(announcement.deletedAt),
  };
};
```

## 6. Add repository

Create:

```txt
src/modules/announcement/announcement.repository.ts
```

Code:

```ts
import type { ResultSetHeader } from "mysql2";

import { db } from "../../config/db";
import type {
  AnnouncementRecord,
  AnnouncementRow,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "./announcement.interface";

const baseAnnouncementSelect = `
  SELECT
    id,
    title,
    body,
    is_active AS isActive,
    created_at AS createdAt,
    updated_at AS updatedAt,
    deleted_at AS deletedAt
  FROM announcements
`;

const mapAnnouncement = (row: AnnouncementRow): AnnouncementRecord => {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    isActive: Boolean(row.isActive),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
};

const findOne = async (
  query: string,
  values: unknown[],
): Promise<AnnouncementRecord | null> => {
  const [rows] = await db.query<AnnouncementRow[]>(query, values);
  const announcement = rows[0];

  return announcement ? mapAnnouncement(announcement) : null;
};

export const announcementRepository = {
  async findAll(): Promise<AnnouncementRecord[]> {
    const [rows] = await db.query<AnnouncementRow[]>(
      `${baseAnnouncementSelect} WHERE deleted_at IS NULL ORDER BY created_at DESC, id DESC`,
    );

    return rows.map(mapAnnouncement);
  },

  async findById(announcementId: number): Promise<AnnouncementRecord | null> {
    return findOne(
      `${baseAnnouncementSelect} WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
      [announcementId],
    );
  },

  async createAnnouncement(payload: CreateAnnouncementInput): Promise<AnnouncementRecord> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        INSERT INTO announcements (title, body, is_active)
        VALUES (?, ?, ?)
      `,
      [payload.title, payload.body, payload.isActive ? 1 : 0],
    );

    const createdAnnouncement = await this.findById(result.insertId);

    if (!createdAnnouncement) {
      throw new Error("Failed to fetch created announcement.");
    }

    return createdAnnouncement;
  },

  async updateAnnouncement(
    announcementId: number,
    payload: UpdateAnnouncementInput,
  ): Promise<AnnouncementRecord> {
    await db.execute(
      `
        UPDATE announcements
        SET title = ?, body = ?, is_active = ?
        WHERE id = ? AND deleted_at IS NULL
      `,
      [payload.title, payload.body, payload.isActive ? 1 : 0, announcementId],
    );

    const updatedAnnouncement = await this.findById(announcementId);

    if (!updatedAnnouncement) {
      throw new Error("Failed to fetch updated announcement.");
    }

    return updatedAnnouncement;
  },

  async softDeleteAnnouncement(announcementId: number): Promise<boolean> {
    const [result] = await db.execute<ResultSetHeader>(
      `
        UPDATE announcements
        SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
      `,
      [announcementId],
    );

    return result.affectedRows > 0;
  },
};
```

## 7. Add service

Create:

```txt
src/modules/announcement/announcement.service.ts
```

Code:

```ts
import { HttpError } from "../../common/utils/http-error";
import { toAnnouncementResponseDto } from "./announcement.dto";
import type {
  AnnouncementRecord,
  CreateAnnouncementDto,
  CreateAnnouncementInput,
  UpdateAnnouncementDto,
  UpdateAnnouncementInput,
} from "./announcement.interface";
import { announcementRepository } from "./announcement.repository";

const buildCreateAnnouncementInput = (
  payload: CreateAnnouncementDto,
): CreateAnnouncementInput => {
  return {
    title: payload.title,
    body: payload.body,
    isActive: payload.isActive,
  };
};

const buildUpdateAnnouncementInput = (
  currentAnnouncement: AnnouncementRecord,
  payload: UpdateAnnouncementDto,
): UpdateAnnouncementInput => {
  return {
    title: payload.title ?? currentAnnouncement.title,
    body: payload.body ?? currentAnnouncement.body,
    isActive: payload.isActive ?? currentAnnouncement.isActive,
  };
};

export const announcementService = {
  async getAllAnnouncements() {
    const announcements = await announcementRepository.findAll();
    return announcements.map(toAnnouncementResponseDto);
  },

  async getAnnouncementById(announcementId: number) {
    const announcement = await announcementRepository.findById(announcementId);

    if (!announcement) {
      throw new HttpError(404, "Announcement not found.");
    }

    return toAnnouncementResponseDto(announcement);
  },

  async createAnnouncement(payload: CreateAnnouncementDto) {
    const announcement = await announcementRepository.createAnnouncement(
      buildCreateAnnouncementInput(payload),
    );

    return toAnnouncementResponseDto(announcement);
  },

  async updateAnnouncement(announcementId: number, payload: UpdateAnnouncementDto) {
    const currentAnnouncement = await announcementRepository.findById(announcementId);

    if (!currentAnnouncement) {
      throw new HttpError(404, "Announcement not found.");
    }

    const announcement = await announcementRepository.updateAnnouncement(
      announcementId,
      buildUpdateAnnouncementInput(currentAnnouncement, payload),
    );

    return toAnnouncementResponseDto(announcement);
  },

  async deleteAnnouncement(announcementId: number) {
    const currentAnnouncement = await announcementRepository.findById(announcementId);

    if (!currentAnnouncement) {
      throw new HttpError(404, "Announcement not found.");
    }

    await announcementRepository.softDeleteAnnouncement(announcementId);
  },
};
```

## 8. Add controller

Create:

```txt
src/modules/announcement/announcement.controller.ts
```

Code:

```ts
import type { Request, Response } from "express";

import { sendSuccess } from "../../common/response";
import {
  parseAnnouncementIdParam,
  parseCreateAnnouncementDto,
  parseUpdateAnnouncementDto,
} from "./announcement.dto";
import { announcementService } from "./announcement.service";

export const announcementController = {
  async getAllAnnouncements(_request: Request, response: Response): Promise<void> {
    const announcements = await announcementService.getAllAnnouncements();
    sendSuccess(response, 200, "Announcements fetched successfully.", announcements);
  },

  async createAnnouncement(request: Request, response: Response): Promise<void> {
    const payload = parseCreateAnnouncementDto(request.body);
    const announcement = await announcementService.createAnnouncement(payload);
    sendSuccess(response, 201, "Announcement created successfully.", announcement);
  },

  async getAnnouncementById(request: Request, response: Response): Promise<void> {
    const announcementId = parseAnnouncementIdParam(request.params.id);
    const announcement = await announcementService.getAnnouncementById(announcementId);
    sendSuccess(response, 200, "Announcement fetched successfully.", announcement);
  },

  async updateAnnouncement(request: Request, response: Response): Promise<void> {
    const announcementId = parseAnnouncementIdParam(request.params.id);
    const payload = parseUpdateAnnouncementDto(request.body);
    const announcement = await announcementService.updateAnnouncement(announcementId, payload);
    sendSuccess(response, 200, "Announcement updated successfully.", announcement);
  },

  async deleteAnnouncement(request: Request, response: Response): Promise<void> {
    const announcementId = parseAnnouncementIdParam(request.params.id);
    await announcementService.deleteAnnouncement(announcementId);
    sendSuccess(response, 200, "Announcement soft deleted successfully.");
  },
};
```

## 9. Add routes

Create:

```txt
src/modules/announcement/announcement.routes.ts
```

Code:

```ts
import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { announcementController } from "./announcement.controller";

const announcementRouter = Router();

announcementRouter.use(authMiddleware);

announcementRouter.get("/", asyncHandler(announcementController.getAllAnnouncements));
announcementRouter.post("/", asyncHandler(announcementController.createAnnouncement));
announcementRouter.get("/:id", asyncHandler(announcementController.getAnnouncementById));
announcementRouter.put("/:id", asyncHandler(announcementController.updateAnnouncement));
announcementRouter.delete("/:id", asyncHandler(announcementController.deleteAnnouncement));

export default announcementRouter;
```

Use `authMiddleware` if the endpoint requires logged-in users.
Use `asyncHandler` on async route handlers so thrown errors go to `errorMiddleware`.

## 10. Add module exports

Create:

```txt
src/modules/announcement/index.ts
```

Code:

```ts
export { announcementRepository } from "./announcement.repository";
export { announcementService } from "./announcement.service";
export { announcementController } from "./announcement.controller";
export { default as announcementRouter } from "./announcement.routes";
export type {
  AnnouncementRecord,
  AnnouncementResponseDto,
  CreateAnnouncementDto,
  CreateAnnouncementInput,
  UpdateAnnouncementDto,
  UpdateAnnouncementInput,
} from "./announcement.interface";
```

## 11. Add Swagger docs

Create:

```txt
src/modules/announcement/announcement.swagger.ts
```

Code:

```ts
import {
  bearerSecurity,
  createApiPath,
  createErrorResponse,
  createJsonRequestBody,
  createSuccessResponse,
} from "../../docs/swagger.helpers";
import type { SwaggerModule } from "../../docs/swagger.types";

const unauthorizedResponse = createErrorResponse(
  "Missing or invalid token.",
  "Authentication token is missing or invalid.",
);

const notFoundResponse = createErrorResponse(
  "Announcement not found.",
  "Announcement not found.",
);

export const announcementSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Announcements",
      description: "Protected announcement CRUD endpoints.",
    },
  ],
  schemas: {
    AnnouncementResponse: {
      type: "object",
      required: ["id", "title", "body", "isActive", "createdAt", "updatedAt", "deletedAt"],
      properties: {
        id: { type: "integer", example: 1 },
        title: { type: "string", example: "Enrollment reminder" },
        body: { type: "string", example: "Enrollment for the active school year is open." },
        isActive: { type: "boolean", example: true },
        createdAt: { type: "string", format: "date-time", example: "2026-05-31T10:00:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-05-31T10:00:00.000Z" },
        deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
      },
    },
    CreateAnnouncementRequest: {
      type: "object",
      required: ["title", "body"],
      properties: {
        title: { type: "string", example: "Enrollment reminder" },
        body: { type: "string", example: "Enrollment for the active school year is open." },
        isActive: { type: "boolean", example: true },
      },
    },
    UpdateAnnouncementRequest: {
      type: "object",
      minProperties: 1,
      properties: {
        title: { type: "string", example: "Updated title" },
        body: { type: "string", example: "Updated body." },
        isActive: { type: "boolean", example: true },
      },
    },
  },
  paths: {
    [createApiPath("/announcements")]: {
      get: {
        tags: ["Announcements"],
        summary: "Get all announcements",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse(
            "Announcements fetched successfully.",
            "Announcements fetched successfully.",
            {
              type: "array",
              items: { $ref: "#/components/schemas/AnnouncementResponse" },
            },
          ),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Announcements"],
        summary: "Create announcement",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Announcement create payload",
          { $ref: "#/components/schemas/CreateAnnouncementRequest" },
        ),
        responses: {
          "201": createSuccessResponse(
            "Announcement created successfully.",
            "Announcement created successfully.",
            { $ref: "#/components/schemas/AnnouncementResponse" },
          ),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/announcements/{id}")]: {
      get: {
        tags: ["Announcements"],
        summary: "Get announcement by ID",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Announcement fetched successfully.",
            "Announcement fetched successfully.",
            { $ref: "#/components/schemas/AnnouncementResponse" },
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Announcements"],
        summary: "Update announcement",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "Announcement update payload",
          { $ref: "#/components/schemas/UpdateAnnouncementRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "Announcement updated successfully.",
            "Announcement updated successfully.",
            { $ref: "#/components/schemas/AnnouncementResponse" },
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Announcements"],
        summary: "Soft delete announcement",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Announcement soft deleted successfully.",
            "Announcement soft deleted successfully.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
};
```

## 12. Register the module

Open:

```txt
src/modules/index.ts
```

Add imports:

```ts
import { announcementRouter } from "./announcement";
import { announcementSwaggerModule } from "./announcement/announcement.swagger";
```

Add to `apiModules`:

```ts
{
  name: "announcements",
  route: "/announcements",
  router: announcementRouter,
  swagger: announcementSwaggerModule,
},
```

After this, the endpoint becomes:

```txt
/api/announcements
```

The API root `/api` should also show `announcements` in the modules list.

## 13. Add permissions if needed

If the module should appear in Roles & Permissions, check the RBAC module:

```txt
src/modules/rbac/
```

Use the existing RBAC endpoints or seed pattern to add a module permission like:

```txt
announcement.view
announcement.create
announcement.update
announcement.delete
```

Do this only if the frontend page needs permission-based access.

## 14. Run backend checks

From the backend folder:

```bash
npm run check
```

Start dev server:

```bash
npm run dev
```

Useful URLs:

```txt
http://localhost:3001/health
http://localhost:3001/api
http://localhost:3001/docs
http://localhost:3001/docs.json
```

Port depends on `.env`.

## 15. Test with a token

Most module routes use `authMiddleware`, so login first and copy the token.

Example request:

```bash
curl -X GET http://localhost:3001/api/announcements ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Create request:

```bash
curl -X POST http://localhost:3001/api/announcements ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"title\":\"Enrollment reminder\",\"body\":\"Enrollment is open.\",\"isActive\":true}"
```

## 16. Backend checklist

Before connecting to frontend, confirm:

- `npm run check` passes.
- New table exists after starting the server.
- `/api` includes the new module.
- `/docs` includes the new Swagger section.
- `GET /api/<module>` works with token.
- `POST`, `PUT`, and `DELETE` return the expected success message.
- Soft delete uses `deleted_at`, not hard delete, unless the data should truly be removed.

## 17. Naming pattern to follow

Use singular folder and file prefix when the module represents one domain:

```txt
src/modules/announcement/announcement.service.ts
```

Use plural route names:

```txt
/api/announcements
```

Keep business rules in service files, not controller files.
Keep SQL in repository files, not service files.
Keep request validation in DTO files, not controller files.
