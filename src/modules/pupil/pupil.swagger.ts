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
  "Pupil not found.",
  "Pupil not found.",
);

const conflictResponse = createErrorResponse(
  "Pupil conflict error.",
  "LRN is already in use.",
);

export const pupilSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Pupils",
      description: "Protected pupil CRUD endpoints.",
    },
  ],
  schemas: {
    PupilResponse: {
      type: "object",
      required: [
        "id",
        "lrn",
        "firstName",
        "middleName",
        "lastName",
        "suffix",
        "sex",
        "birthdate",
        "birthplace",
        "streetAddress",
        "barangay",
        "cityMunicipality",
        "province",
        "region",
        "status",
        "profilePicture",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
      properties: {
        id: { type: "integer", example: 1 },
        lrn: { type: "string", example: "123456789012" },
        firstName: { type: "string", example: "Juan" },
        middleName: { type: "string", nullable: true, example: "Santos" },
        lastName: { type: "string", example: "Dela Cruz" },
        suffix: { type: "string", nullable: true, example: "Jr." },
        sex: { type: "string", enum: ["male", "female"], example: "male" },
        birthdate: { type: "string", format: "date", example: "2012-05-14" },
        birthplace: { type: "string", nullable: true, example: "Talisay City" },
        streetAddress: { type: "string", nullable: true, example: "Purok 1, San Isidro" },
        barangay: { type: "string", example: "San Isidro" },
        cityMunicipality: { type: "string", example: "Talisay City" },
        province: { type: "string", example: "Cebu" },
        region: { type: "string", example: "Region VII" },
        status: {
          type: "string",
          enum: ["active", "inactive", "transferred", "graduated"],
          example: "active",
        },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "/uploads/images/pupil-profile-picture.jpg",
        },
        createdAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
      },
    },
    CreatePupilRequest: {
      type: "object",
      required: [
        "lrn",
        "firstName",
        "lastName",
        "sex",
        "birthdate",
        "barangay",
        "cityMunicipality",
        "province",
        "region",
      ],
      properties: {
        lrn: { type: "string", example: "123456789012" },
        firstName: { type: "string", example: "Juan" },
        middleName: { type: "string", nullable: true, example: "Santos" },
        lastName: { type: "string", example: "Dela Cruz" },
        suffix: { type: "string", nullable: true, example: "Jr." },
        sex: { type: "string", enum: ["male", "female"], example: "male" },
        birthdate: { type: "string", format: "date", example: "2012-05-14" },
        birthplace: { type: "string", nullable: true, example: "Talisay City" },
        streetAddress: { type: "string", nullable: true, example: "Purok 1, San Isidro" },
        barangay: { type: "string", example: "San Isidro" },
        cityMunicipality: { type: "string", example: "Talisay City" },
        province: { type: "string", example: "Cebu" },
        region: { type: "string", example: "Region VII" },
        status: {
          type: "string",
          enum: ["active", "inactive", "transferred", "graduated"],
          example: "active",
        },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "/uploads/images/pupil-profile-picture.jpg",
        },
      },
    },
    UpdatePupilRequest: {
      type: "object",
      minProperties: 1,
      properties: {
        lrn: { type: "string", example: "123456789012" },
        firstName: { type: "string", example: "Juan" },
        middleName: { type: "string", nullable: true, example: "Santos" },
        lastName: { type: "string", example: "Dela Cruz" },
        suffix: { type: "string", nullable: true, example: "Jr." },
        sex: { type: "string", enum: ["male", "female"], example: "male" },
        birthdate: { type: "string", format: "date", example: "2012-05-14" },
        birthplace: { type: "string", nullable: true, example: "Talisay City" },
        streetAddress: { type: "string", nullable: true, example: "Purok 1, San Isidro" },
        barangay: { type: "string", example: "San Isidro" },
        cityMunicipality: { type: "string", example: "Talisay City" },
        province: { type: "string", example: "Cebu" },
        region: { type: "string", example: "Region VII" },
        status: {
          type: "string",
          enum: ["active", "inactive", "transferred", "graduated"],
          example: "transferred",
        },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "/uploads/images/pupil-profile-picture.jpg",
        },
      },
    },
  },
  paths: {
    [createApiPath("/pupils")]: {
      get: {
        tags: ["Pupils"],
        summary: "Get all active pupils",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Pupils fetched successfully.", "Pupils fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/PupilResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Pupils"],
        summary: "Create pupil",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Pupil create payload",
          { $ref: "#/components/schemas/CreatePupilRequest" },
        ),
        responses: {
          "201": createSuccessResponse("Pupil created successfully.", "Pupil created successfully.", {
            $ref: "#/components/schemas/PupilResponse",
          }),
          "401": unauthorizedResponse,
          "409": conflictResponse,
        },
      },
    },
    [createApiPath("/pupils/{id}")]: {
      get: {
        tags: ["Pupils"],
        summary: "Get pupil by ID",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse("Pupil fetched successfully.", "Pupil fetched successfully.", {
            $ref: "#/components/schemas/PupilResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Pupils"],
        summary: "Update pupil",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "Pupil update payload",
          { $ref: "#/components/schemas/UpdatePupilRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Pupil updated successfully.", "Pupil updated successfully.", {
            $ref: "#/components/schemas/PupilResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "409": conflictResponse,
        },
      },
      delete: {
        tags: ["Pupils"],
        summary: "Soft delete pupil",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Pupil soft deleted successfully.",
            "Pupil soft deleted successfully.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
};
