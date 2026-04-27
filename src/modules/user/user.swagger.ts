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
  "User not found.",
  "User not found.",
);

const conflictResponse = createErrorResponse(
  "User conflict error.",
  "Email is already in use.",
);

const invalidPasswordResponse = createErrorResponse(
  "Current password is incorrect.",
  "Current password is incorrect.",
);

export const userSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Users",
      description: "Protected user CRUD endpoints.",
    },
  ],
  schemas: {
    UserResponse: {
      type: "object",
      required: [
        "id",
        "name",
        "firstName",
        "middleName",
        "lastName",
        "suffix",
        "sex",
        "email",
        "contactNumber",
        "address",
        "barangay",
        "municipalityCity",
        "province",
        "region",
        "username",
        "roles",
        "position",
        "status",
        "profilePicture",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", nullable: true, example: "Mark Emil Dacoylo" },
        firstName: { type: "string", example: "Mark" },
        middleName: { type: "string", nullable: true, example: "Emil" },
        lastName: { type: "string", nullable: true, example: "Dacoylo" },
        suffix: { type: "string", nullable: true, example: "" },
        sex: { type: "string", nullable: true, example: "male" },
        email: { type: "string", format: "email", example: "mark@example.com" },
        contactNumber: { type: "string", nullable: true, example: "09171234567" },
        address: { type: "string", nullable: true, example: "Purok 1, San Isidro" },
        barangay: { type: "string", nullable: true, example: "San Isidro" },
        municipalityCity: { type: "string", nullable: true, example: "Talisay City" },
        province: { type: "string", nullable: true, example: "Cebu" },
        region: { type: "string", nullable: true, example: "Region VII" },
        username: { type: "string", nullable: true, example: "mark.dacoylo" },
        roles: {
          type: "array",
          items: { type: "string" },
          example: ["admin", "developer"],
        },
        position: { type: "string", nullable: true, example: "System Administrator" },
        status: { type: "string", example: "active" },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        createdAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-01-10T08:30:00.000Z" },
        deletedAt: { type: "string", format: "date-time", nullable: true, example: null },
      },
    },
    CreateUserRequest: {
      type: "object",
      required: ["firstName", "email", "password"],
      properties: {
        name: { type: "string", nullable: true, example: "Mark Emil Dacoylo" },
        firstName: { type: "string", example: "Mark" },
        middleName: { type: "string", nullable: true, example: "Emil" },
        lastName: { type: "string", nullable: true, example: "Dacoylo" },
        suffix: { type: "string", nullable: true, example: "" },
        sex: { type: "string", nullable: true, example: "male" },
        email: { type: "string", format: "email", example: "mark@example.com" },
        contactNumber: { type: "string", nullable: true, example: "09171234567" },
        address: { type: "string", nullable: true, example: "Purok 1, San Isidro" },
        barangay: { type: "string", nullable: true, example: "San Isidro" },
        municipalityCity: { type: "string", nullable: true, example: "Talisay City" },
        province: { type: "string", nullable: true, example: "Cebu" },
        region: { type: "string", nullable: true, example: "Region VII" },
        username: { type: "string", nullable: true, example: "mark.dacoylo" },
        password: { type: "string", format: "password", example: "StrongPassword123!" },
        roles: {
          type: "array",
          items: { type: "string" },
          example: ["admin", "developer"],
        },
        position: { type: "string", nullable: true, example: "System Administrator" },
        status: { type: "string", example: "active" },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "https://randomuser.me/api/portraits/men/1.jpg",
        },
      },
    },
    UpdateUserRequest: {
      type: "object",
      minProperties: 1,
      properties: {
        name: { type: "string", nullable: true, example: "Mark Emil Dacoylo" },
        firstName: { type: "string", example: "Mark" },
        middleName: { type: "string", nullable: true, example: "Emil" },
        lastName: { type: "string", nullable: true, example: "Dacoylo" },
        suffix: { type: "string", nullable: true, example: "" },
        sex: { type: "string", nullable: true, example: "male" },
        email: { type: "string", format: "email", example: "mark@example.com" },
        contactNumber: { type: "string", nullable: true, example: "09171234567" },
        address: { type: "string", nullable: true, example: "Purok 1, San Isidro" },
        barangay: { type: "string", nullable: true, example: "San Isidro" },
        municipalityCity: { type: "string", nullable: true, example: "Talisay City" },
        province: { type: "string", nullable: true, example: "Cebu" },
        region: { type: "string", nullable: true, example: "Region VII" },
        username: { type: "string", nullable: true, example: "mark.dacoylo" },
        password: { type: "string", format: "password", example: "NewStrongPassword123!" },
        roles: {
          type: "array",
          items: { type: "string" },
          example: ["admin", "developer"],
        },
        position: { type: "string", nullable: true, example: "System Administrator" },
        status: { type: "string", example: "inactive" },
        profilePicture: {
          type: "string",
          nullable: true,
          example: "https://randomuser.me/api/portraits/men/1.jpg",
        },
      },
    },
    ChangePasswordRequest: {
      type: "object",
      required: ["currentPassword", "newPassword"],
      properties: {
        currentPassword: {
          type: "string",
          format: "password",
          example: "CurrentPassword123!",
        },
        newPassword: {
          type: "string",
          format: "password",
          example: "NewStrongPassword123!",
        },
      },
    },
  },
  paths: {
    [createApiPath("/users")]: {
      get: {
        tags: ["Users"],
        summary: "Get all active users",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Users fetched successfully.", "Users fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/UserResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "User create payload",
          { $ref: "#/components/schemas/CreateUserRequest" },
        ),
        responses: {
          "201": createSuccessResponse("User created successfully.", "User created successfully.", {
            $ref: "#/components/schemas/UserResponse",
          }),
          "401": unauthorizedResponse,
          "409": conflictResponse,
        },
      },
    },
    [createApiPath("/users/me")]: {
      get: {
        tags: ["Users"],
        summary: "Get the authenticated user",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse(
            "Current user fetched successfully.",
            "Current user fetched successfully.",
            { $ref: "#/components/schemas/UserResponse" },
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update the authenticated user's profile",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Current user profile update payload",
          { $ref: "#/components/schemas/UpdateUserRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "Current user updated successfully.",
            "Current user updated successfully.",
            { $ref: "#/components/schemas/UserResponse" },
          ),
          "400": createErrorResponse(
            "At least one editable profile field is required for update.",
            "At least one editable profile field is required for update.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "409": conflictResponse,
        },
      },
    },
    [createApiPath("/users/me/password")]: {
      put: {
        tags: ["Users"],
        summary: "Change the authenticated user's password",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Change password payload",
          { $ref: "#/components/schemas/ChangePasswordRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "Password updated successfully.",
            "Password updated successfully.",
          ),
          "400": createErrorResponse(
            "Invalid change password payload.",
            "newPassword must be different from currentPassword.",
          ),
          "401": invalidPasswordResponse,
          "404": notFoundResponse,
        },
      },
    },
    [createApiPath("/users/{id}")]: {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse("User fetched successfully.", "User fetched successfully.", {
            $ref: "#/components/schemas/UserResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update user",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        requestBody: createJsonRequestBody(
          "User update payload",
          { $ref: "#/components/schemas/UpdateUserRequest" },
        ),
        responses: {
          "200": createSuccessResponse("User updated successfully.", "User updated successfully.", {
            $ref: "#/components/schemas/UserResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "409": conflictResponse,
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Soft delete user",
        security: bearerSecurity,
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
        responses: {
          "200": createSuccessResponse(
            "User soft deleted successfully.",
            "User soft deleted successfully.",
          ),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
};
