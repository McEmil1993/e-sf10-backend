import { bearerSecurity, createApiPath, createErrorResponse, createSuccessResponse } from "../../docs/swagger.helpers";
import type { SwaggerModule } from "../../docs/swagger.types";

const unauthorizedResponse = createErrorResponse(
  "Missing or invalid token.",
  "Authentication token is missing or invalid.",
);

export const academicSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Academic Records",
      description: "Protected SF10 academic-record endpoints.",
    },
  ],
  paths: {
    [createApiPath("/academic/{entity}")]: {
      get: {
        tags: ["Academic Records"],
        summary: "List academic records by entity",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "entity", required: true, schema: { type: "string" } }],
        responses: {
          "200": createSuccessResponse("Records fetched successfully.", "Records fetched successfully.", {
            type: "array",
            items: { type: "object" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Academic Records"],
        summary: "Create academic record by entity",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "entity", required: true, schema: { type: "string" } }],
        responses: {
          "201": createSuccessResponse("Record created successfully.", "Record created successfully.", {
            type: "object",
          }),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/academic/{entity}/{id}")]: {
      get: {
        tags: ["Academic Records"],
        summary: "Get academic record by ID",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "entity", required: true, schema: { type: "string" } },
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Record fetched successfully.", "Record fetched successfully.", {
            type: "object",
          }),
          "401": unauthorizedResponse,
        },
      },
      put: {
        tags: ["Academic Records"],
        summary: "Update academic record by ID",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "entity", required: true, schema: { type: "string" } },
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Record updated successfully.", "Record updated successfully.", {
            type: "object",
          }),
          "401": unauthorizedResponse,
        },
      },
      delete: {
        tags: ["Academic Records"],
        summary: "Soft delete academic record by ID",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "entity", required: true, schema: { type: "string" } },
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Record soft deleted successfully.", "Record soft deleted successfully."),
          "401": unauthorizedResponse,
        },
      },
    },
  },
};
