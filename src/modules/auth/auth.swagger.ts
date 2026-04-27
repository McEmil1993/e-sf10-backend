import {
  bearerSecurity,
  createApiPath,
  createErrorResponse,
  createJsonRequestBody,
  createSuccessResponse,
} from "../../docs/swagger.helpers";
import type { SwaggerModule } from "../../docs/swagger.types";

export const authSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Auth",
      description: "Authentication endpoints for registration and login.",
    },
  ],
  schemas: {
    RegisterRequest: {
      type: "object",
      required: ["firstName", "email", "password"],
      properties: {
        firstName: {
          type: "string",
          example: "Mark",
        },
        lastName: {
          type: "string",
          nullable: true,
          example: "Dacoylo",
        },
        email: {
          type: "string",
          format: "email",
          example: "mark@example.com",
        },
        password: {
          type: "string",
          format: "password",
          example: "password123",
        },
      },
    },
    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "mark@example.com",
        },
        password: {
          type: "string",
          format: "password",
          example: "password123",
        },
      },
    },
    AuthResponseData: {
      type: "object",
      required: ["user", "token"],
      properties: {
        user: {
          $ref: "#/components/schemas/UserResponse",
        },
        token: {
          type: "string",
          description: "JWT bearer token.",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token",
        },
      },
    },
  },
  paths: {
    [createApiPath("/auth/register")]: {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: createJsonRequestBody(
          "User registration payload",
          { $ref: "#/components/schemas/RegisterRequest" },
        ),
        responses: {
          "201": createSuccessResponse(
            "User created successfully.",
            "User registered successfully.",
            { $ref: "#/components/schemas/AuthResponseData" },
          ),
          "400": createErrorResponse(
            "Validation error.",
            "password must be at least 6 characters long.",
          ),
          "409": createErrorResponse(
            "Email is already registered.",
            "Email is already registered.",
          ),
        },
      },
    },
    [createApiPath("/auth/login")]: {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        requestBody: createJsonRequestBody(
          "Login payload",
          { $ref: "#/components/schemas/LoginRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "Authenticated successfully.",
            "Login successful.",
            { $ref: "#/components/schemas/AuthResponseData" },
          ),
          "400": createErrorResponse(
            "Validation error.",
            "password is required.",
          ),
          "401": createErrorResponse(
            "Invalid credentials.",
            "Invalid email or password.",
          ),
        },
      },
    },
    [createApiPath("/auth/logout")]: {
      post: {
        tags: ["Auth"],
        summary: "Logout the authenticated user",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse(
            "Logged out successfully.",
            "Logout successful.",
          ),
          "401": createErrorResponse(
            "Missing or invalid token.",
            "Authentication token is missing or invalid.",
          ),
        },
      },
    },
  },
};
