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
  "Guardian not found.",
  "Guardian not found.",
);

export const guardianSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Guardians",
      description: "Protected guardian CRUD endpoints.",
    },
  ],
  schemas: {
    GuardianResponse: {
      type: "object",
      required: [
        "id",
        "firstName",
        "middleName",
        "lastName",
        "suffix",
        "contactNumber",
        "address",
        "barangay",
        "municipalityCity",
        "province",
        "region",
        "profilePicture",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
      properties: {
        id: { type: "integer", example: 1 },
        firstName: { type: "string", example: "Maria" },
        middleName: { type: "string", nullable: true, example: "Santos" },
        lastName: { type: "string", example: "Dela Cruz" },
        suffix: { type: "string", nullable: true, example: "Sr." },
        contactNumber: { type: "string", example: "09171234567" },
        address: { type: "string", example: "Purok 1, San Isidro" },
        barangay: { type: "string", example: "San Isidro" },
        municipalityCity: { type: "string", example: "Talisay City" },
        province: { type: "string", example: "Cebu" },
        region: { type: "string", example: "Region VII" },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "/uploads/images/guardian-profile-picture.jpg",
        },
        createdAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
      },
    },
    CreateGuardianRequest: {
      type: "object",
      required: [
        "firstName",
        "lastName",
        "contactNumber",
        "address",
        "barangay",
        "municipalityCity",
        "province",
        "region",
      ],
      properties: {
        firstName: { type: "string", example: "Maria" },
        middleName: { type: "string", nullable: true, example: "Santos" },
        lastName: { type: "string", example: "Dela Cruz" },
        suffix: { type: "string", nullable: true, example: "Sr." },
        contactNumber: { type: "string", example: "09171234567" },
        address: { type: "string", example: "Purok 1, San Isidro" },
        barangay: { type: "string", example: "San Isidro" },
        municipalityCity: { type: "string", example: "Talisay City" },
        province: { type: "string", example: "Cebu" },
        region: { type: "string", example: "Region VII" },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "/uploads/images/guardian-profile-picture.jpg",
        },
      },
    },
    UpdateGuardianRequest: {
      type: "object",
      minProperties: 1,
      properties: {
        firstName: { type: "string", example: "Maria" },
        middleName: { type: "string", nullable: true, example: "Santos" },
        lastName: { type: "string", example: "Dela Cruz" },
        suffix: { type: "string", nullable: true, example: "Sr." },
        contactNumber: { type: "string", example: "09171234567" },
        address: { type: "string", example: "Purok 1, San Isidro" },
        barangay: { type: "string", example: "San Isidro" },
        municipalityCity: { type: "string", example: "Talisay City" },
        province: { type: "string", example: "Cebu" },
        region: { type: "string", example: "Region VII" },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "/uploads/images/guardian-profile-picture.jpg",
        },
      },
    },
  },
  paths: {
    [createApiPath("/guardians")]: {
      get: {
        tags: ["Guardians"],
        summary: "Get all active guardians",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Guardians fetched successfully.", "Guardians fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/GuardianResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Guardians"],
        summary: "Create guardian",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Guardian create payload",
          { $ref: "#/components/schemas/CreateGuardianRequest" },
        ),
        responses: {
          "201": createSuccessResponse("Guardian created successfully.", "Guardian created successfully.", {
            $ref: "#/components/schemas/GuardianResponse",
          }),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/guardians/{id}")]: {
      get: {
        tags: ["Guardians"],
        summary: "Get guardian by ID",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse("Guardian fetched successfully.", "Guardian fetched successfully.", {
            $ref: "#/components/schemas/GuardianResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Guardians"],
        summary: "Update guardian",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "Guardian update payload",
          { $ref: "#/components/schemas/UpdateGuardianRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Guardian updated successfully.", "Guardian updated successfully.", {
            $ref: "#/components/schemas/GuardianResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Guardians"],
        summary: "Soft delete guardian",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Guardian soft deleted successfully.",
            "Guardian soft deleted successfully.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
};
