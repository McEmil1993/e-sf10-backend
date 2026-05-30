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

const notFoundResponse = createErrorResponse("Subject not found.", "Subject not found.");

export const subjectSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Subjects",
      description: "Protected SF10 subject CRUD endpoints.",
    },
  ],
  schemas: {
    SubjectResponse: {
      type: "object",
      required: [
        "id",
        "name",
        "subjectGroup",
        "gradeLevels",
        "isOptional",
        "sortOrder",
        "isActive",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Mother Tongue" },
        subjectGroup: { type: "string", nullable: true, example: "Core" },
        gradeLevels: {
          type: "array",
          items: { type: "integer", enum: [1, 2, 3, 4, 5, 6] },
          example: [1, 2, 3],
        },
        isOptional: { type: "boolean", example: false },
        sortOrder: { type: "integer", example: 1 },
        isActive: { type: "boolean", example: true },
        createdAt: { type: "string", format: "date-time", example: "2026-04-24T12:34:37.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-04-24T12:34:37.000Z" },
        deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
      },
    },
    CreateSubjectRequest: {
      type: "object",
      required: ["name", "gradeLevels"],
      properties: {
        name: { type: "string", example: "Arabic Language" },
        subjectGroup: { type: "string", nullable: true, example: "ALIVE Program" },
        gradeLevels: {
          type: "array",
          items: { type: "integer", enum: [1, 2, 3, 4, 5, 6] },
          example: [1, 2, 3, 4, 5, 6],
        },
        isOptional: { type: "boolean", example: true },
        sortOrder: { type: "integer", example: 13 },
        isActive: { type: "boolean", example: true },
      },
    },
    UpdateSubjectRequest: {
      type: "object",
      minProperties: 1,
      properties: {
        name: { type: "string", example: "Edukasyon sa Pagpapakatao" },
        subjectGroup: { type: "string", nullable: true, example: "Core" },
        gradeLevels: {
          type: "array",
          items: { type: "integer", enum: [1, 2, 3, 4, 5, 6] },
          example: [1, 2, 3, 4, 5, 6],
        },
        isOptional: { type: "boolean", example: false },
        sortOrder: { type: "integer", example: 12 },
        isActive: { type: "boolean", example: true },
      },
    },
  },
  paths: {
    [createApiPath("/subjects")]: {
      get: {
        tags: ["Subjects"],
        summary: "Get all active subjects",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Subjects fetched successfully.", "Subjects fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/SubjectResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Subjects"],
        summary: "Create subject",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Subject create payload",
          { $ref: "#/components/schemas/CreateSubjectRequest" },
        ),
        responses: {
          "201": createSuccessResponse("Subject created successfully.", "Subject created successfully.", {
            $ref: "#/components/schemas/SubjectResponse",
          }),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/subjects/{id}")]: {
      get: {
        tags: ["Subjects"],
        summary: "Get subject by ID",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse("Subject fetched successfully.", "Subject fetched successfully.", {
            $ref: "#/components/schemas/SubjectResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Subjects"],
        summary: "Update subject",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "Subject update payload",
          { $ref: "#/components/schemas/UpdateSubjectRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Subject updated successfully.", "Subject updated successfully.", {
            $ref: "#/components/schemas/SubjectResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Subjects"],
        summary: "Soft delete subject",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Subject soft deleted successfully.",
            "Subject soft deleted successfully.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
};
