import {
  bearerSecurity,
  createApiPath,
  createErrorResponse,
  createJsonRequestBody,
  createSuccessResponse,
} from "../../docs/swagger.helpers";
import type { SwaggerModule } from "../../docs/swagger.types";

const schoolSchema = {
  type: "object",
  required: [
    "schoolId",
    "depedSchoolId",
    "schoolName",
    "district",
    "division",
    "region",
    "address",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ],
  properties: {
    schoolId: { type: "integer", example: 1 },
    depedSchoolId: { type: "string", example: "118768" },
    schoolName: { type: "string", example: "Trinidad 1 Central Elementary School" },
    district: { type: "string", example: "Trinidad I" },
    division: { type: "string", example: "Bohol" },
    region: { type: "string", example: "Region VII - Central Visayas" },
    address: { type: "string", example: "Poblacion, Trinidad, Bohol 6324, Philippines" },
    schoolLogo: { type: "string", nullable: true, example: "/uploads/images/school-logo.png" },
    depedLogo: { type: "string", nullable: true, example: "/uploads/images/deped-logo.png" },
    otherLogo: { type: "string", nullable: true, example: "/uploads/images/division-logo.png" },
    createdAt: { type: "string", format: "date-time", example: "2026-04-24T12:34:37.000Z" },
    updatedAt: { type: "string", format: "date-time", example: "2026-04-24T12:34:37.000Z" },
    deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
  },
};

export const systemSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "System Settings",
      description: "Protected school and system settings endpoints.",
    },
  ],
  schemas: {
    SchoolSettingsResponse: schoolSchema,
    UpdateSchoolSettingsRequest: {
      type: "object",
      minProperties: 1,
      properties: schoolSchema.properties,
    },
  },
  paths: {
    [createApiPath("/system/school")]: {
      get: {
        tags: ["System Settings"],
        summary: "Get school settings",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("School settings fetched successfully.", "School settings fetched successfully.", {
            $ref: "#/components/schemas/SchoolSettingsResponse",
          }),
          "401": createErrorResponse("Missing or invalid token.", "Authentication token is missing or invalid."),
          "404": createErrorResponse("School settings not found.", "School settings not found."),
        },
      },
      put: {
        tags: ["System Settings"],
        summary: "Update school settings",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "School settings update payload",
          { $ref: "#/components/schemas/UpdateSchoolSettingsRequest" },
        ),
        responses: {
          "200": createSuccessResponse("School settings updated successfully.", "School settings updated successfully.", {
            $ref: "#/components/schemas/SchoolSettingsResponse",
          }),
          "401": createErrorResponse("Missing or invalid token.", "Authentication token is missing or invalid."),
          "404": createErrorResponse("School settings not found.", "School settings not found."),
        },
      },
    },
  },
};
