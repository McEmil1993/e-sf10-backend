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
  "Position not found.",
  "Position not found.",
);

export const positionSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Positions",
      description: "Protected position CRUD endpoints.",
    },
  ],
  schemas: {
    PositionResponse: {
      type: "object",
      required: ["id", "acronym", "fullPosition", "category", "createdAt", "updatedAt", "deletedAt"],
      properties: {
        id: { type: "integer", example: 1 },
        acronym: { type: "string", example: "T-I" },
        fullPosition: { type: "string", example: "Teacher I" },
        category: { type: "string", example: "Teaching" },
        createdAt: { type: "string", format: "date-time", example: "2026-04-24T12:34:37.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-04-24T12:34:37.000Z" },
        deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
      },
    },
    CreatePositionRequest: {
      type: "object",
      required: ["acronym", "fullPosition", "category"],
      properties: {
        acronym: { type: "string", example: "MT-I" },
        fullPosition: { type: "string", example: "Master Teacher I" },
        category: { type: "string", example: "Teaching" },
      },
    },
    UpdatePositionRequest: {
      type: "object",
      minProperties: 1,
      properties: {
        acronym: { type: "string", example: "AO-II" },
        fullPosition: { type: "string", example: "Administrative Officer II" },
        category: { type: "string", example: "Non-Teaching" },
      },
    },
  },
  paths: {
    [createApiPath("/positions")]: {
      get: {
        tags: ["Positions"],
        summary: "Get all active positions",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Positions fetched successfully.", "Positions fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/PositionResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Positions"],
        summary: "Create position",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Position create payload",
          { $ref: "#/components/schemas/CreatePositionRequest" },
        ),
        responses: {
          "201": createSuccessResponse("Position created successfully.", "Position created successfully.", {
            $ref: "#/components/schemas/PositionResponse",
          }),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/positions/{id}")]: {
      get: {
        tags: ["Positions"],
        summary: "Get position by ID",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse("Position fetched successfully.", "Position fetched successfully.", {
            $ref: "#/components/schemas/PositionResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Positions"],
        summary: "Update position",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "Position update payload",
          { $ref: "#/components/schemas/UpdatePositionRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Position updated successfully.", "Position updated successfully.", {
            $ref: "#/components/schemas/PositionResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Positions"],
        summary: "Soft delete position",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Position soft deleted successfully.",
            "Position soft deleted successfully.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
};
