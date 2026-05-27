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
  "Student not found.",
  "Student not found.",
);

const conflictResponse = createErrorResponse(
  "Student conflict error.",
  "LRN is already in use.",
);

export const studentSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Students",
      description: "Protected student CRUD endpoints.",
    },
  ],
  schemas: {
    StudentResponse: {
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
          example: "/uploads/images/student-profile-picture.jpg",
        },
        createdAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
      },
    },
    CreateStudentRequest: {
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
          example: "/uploads/images/student-profile-picture.jpg",
        },
      },
    },
    UpdateStudentRequest: {
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
          example: "/uploads/images/student-profile-picture.jpg",
        },
      },
    },
    StudentInformationLookup: {
      type: "object",
      required: ["id", "name", "sortOrder", "isActive"],
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Cebuano / Bisaya" },
        sortOrder: { type: "integer", example: 2 },
        isActive: { type: "boolean", example: true },
      },
    },
    StudentInformationLookupsResponse: {
      type: "object",
      required: ["motherTongues", "indigenousGroups", "religions"],
      properties: {
        motherTongues: {
          type: "array",
          items: { $ref: "#/components/schemas/StudentInformationLookup" },
        },
        indigenousGroups: {
          type: "array",
          items: { $ref: "#/components/schemas/StudentInformationLookup" },
        },
        religions: {
          type: "array",
          items: { $ref: "#/components/schemas/StudentInformationLookup" },
        },
      },
    },
    StudentInformationResponse: {
      type: "object",
      required: ["studentId", "motherTongue", "indigenousGroup", "religion"],
      properties: {
        studentId: { type: "integer", example: 1 },
        motherTongue: {
          nullable: true,
          allOf: [{ $ref: "#/components/schemas/StudentInformationLookup" }],
        },
        indigenousGroup: {
          nullable: true,
          allOf: [{ $ref: "#/components/schemas/StudentInformationLookup" }],
        },
        religion: {
          nullable: true,
          allOf: [{ $ref: "#/components/schemas/StudentInformationLookup" }],
        },
      },
    },
    UpdateStudentInformationRequest: {
      type: "object",
      minProperties: 1,
      properties: {
        motherTongueId: { type: "integer", nullable: true, example: 2 },
        motherTongue: { type: "string", nullable: true, example: "Cebuano / Bisaya" },
        indigenousGroupId: { type: "integer", nullable: true, example: 21 },
        indigenousGroup: { type: "string", nullable: true, example: "Non-IP / Not Applicable" },
        indigenousGroupOther: {
          type: "string",
          nullable: true,
          example: "Ati",
          description: "Creates or reuses an indigenous group lookup value when Other is selected.",
        },
        religionId: { type: "integer", nullable: true, example: 1 },
        religion: { type: "string", nullable: true, example: "Roman Catholic" },
      },
    },
  },
  paths: {
    [createApiPath("/students/lookups")]: {
      get: {
        tags: ["Students"],
        summary: "Get student information lookup values",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse(
            "Student information lookups fetched successfully.",
            "Student information lookups fetched successfully.",
            { $ref: "#/components/schemas/StudentInformationLookupsResponse" },
          ),
          "401": unauthorizedResponse,
        },
      },
    },
    [createApiPath("/students")]: {
      get: {
        tags: ["Students"],
        summary: "Get all active students",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Students fetched successfully.", "Students fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/StudentResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Students"],
        summary: "Create student",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Student create payload",
          { $ref: "#/components/schemas/CreateStudentRequest" },
        ),
        responses: {
          "201": createSuccessResponse("Student created successfully.", "Student created successfully.", {
            $ref: "#/components/schemas/StudentResponse",
          }),
          "401": unauthorizedResponse,
          "409": conflictResponse,
        },
      },
    },
    [createApiPath("/students/{id}")]: {
      get: {
        tags: ["Students"],
        summary: "Get student by ID",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse("Student fetched successfully.", "Student fetched successfully.", {
            $ref: "#/components/schemas/StudentResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Students"],
        summary: "Update student",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "Student update payload",
          { $ref: "#/components/schemas/UpdateStudentRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Student updated successfully.", "Student updated successfully.", {
            $ref: "#/components/schemas/StudentResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "409": conflictResponse,
        },
      },
      delete: {
        tags: ["Students"],
        summary: "Soft delete student",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Student soft deleted successfully.",
            "Student soft deleted successfully.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
    [createApiPath("/students/{id}/information")]: {
      get: {
        tags: ["Students"],
        summary: "Get student information lookup selections",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "Student information fetched successfully.",
            "Student information fetched successfully.",
            { $ref: "#/components/schemas/StudentInformationResponse" },
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Students"],
        summary: "Update student information lookup selections",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "Student information lookup payload",
          { $ref: "#/components/schemas/UpdateStudentInformationRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "Student information updated successfully.",
            "Student information updated successfully.",
            { $ref: "#/components/schemas/StudentInformationResponse" },
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
};
