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
      description: "Authentication endpoints for registration, login, and password recovery.",
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
      required: ["identifier", "password"],
      properties: {
        identifier: {
          type: "string",
          description: "Username or email address.",
          example: "dacs1993",
        },
        password: {
          type: "string",
          format: "password",
          example: "password123",
        },
      },
    },
    ForgotPasswordRequest: {
      type: "object",
      required: ["identifier"],
      properties: {
        identifier: {
          type: "string",
          description: "Email address or username.",
          example: "mark@example.com",
        },
        email: {
          type: "string",
          format: "email",
          deprecated: true,
          example: "mark@example.com",
        },
        username: {
          type: "string",
          deprecated: true,
          example: "mark",
        },
      },
    },
    ForgotPasswordResponseData: {
      type: "object",
      required: ["method", "recoveryRequestId", "expiresAt"],
      properties: {
        method: {
          type: "string",
          enum: ["temporary_password", "otp_email"],
          example: "otp_email",
        },
        email: {
          type: "string",
          format: "email",
          example: "mark@example.com",
        },
        recoveryRequestId: {
          type: "number",
          example: 1,
        },
        expiresAt: {
          type: "string",
          format: "date-time",
        },
      },
    },
    VerifyForgotPasswordOtpRequest: {
      type: "object",
      required: ["recoveryRequestId", "email", "otpCode"],
      properties: {
        recoveryRequestId: {
          type: "number",
          example: 1,
        },
        email: {
          type: "string",
          format: "email",
          example: "mark@example.com",
        },
        otpCode: {
          type: "string",
          example: "123456",
        },
      },
    },
    CompleteTemporaryPasswordRequest: {
      type: "object",
      required: ["recoveryRequestId", "newPassword", "confirmNewPassword"],
      properties: {
        recoveryRequestId: {
          type: "number",
          example: 1,
        },
        newPassword: {
          type: "string",
          format: "password",
          example: "NewPassword123!",
        },
        confirmNewPassword: {
          type: "string",
          format: "password",
          example: "NewPassword123!",
        },
      },
    },
    TemporaryPasswordLoginData: {
      type: "object",
      required: ["required", "recoveryRequestId", "expiresAt"],
      nullable: true,
      properties: {
        required: {
          type: "boolean",
          example: true,
        },
        recoveryRequestId: {
          type: "number",
          example: 1,
        },
        expiresAt: {
          type: "string",
          format: "date-time",
        },
      },
    },
    AuthResponseData: {
      type: "object",
      required: ["user", "token", "temporaryPasswordLogin"],
      properties: {
        user: {
          $ref: "#/components/schemas/UserResponse",
        },
        token: {
          type: "string",
          description: "JWT bearer token.",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sample.token",
        },
        temporaryPasswordLogin: {
          $ref: "#/components/schemas/TemporaryPasswordLoginData",
        },
      },
    },
    TemporaryPasswordSessionData: {
      type: "object",
      required: ["user", "temporaryPasswordLogin"],
      properties: {
        user: {
          $ref: "#/components/schemas/UserResponse",
        },
        temporaryPasswordLogin: {
          $ref: "#/components/schemas/TemporaryPasswordLoginData",
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
            "Wrong password!",
          ),
        },
      },
    },
    [createApiPath("/auth/forgot-password")]: {
      post: {
        tags: ["Auth"],
        summary: "Send a password recovery email",
        requestBody: createJsonRequestBody(
          "Forgot password payload",
          { $ref: "#/components/schemas/ForgotPasswordRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "Password recovery email sent.",
            "OTP sent. It expires in 2 minutes.",
            { $ref: "#/components/schemas/ForgotPasswordResponseData" },
          ),
          "400": createErrorResponse(
            "Validation or SMTP configuration error.",
            "Gmail SMTP settings are not configured.",
          ),
          "404": createErrorResponse(
            "Account not found.",
            "Email not exist!",
          ),
        },
      },
    },
    [createApiPath("/auth/forgot-password/otp/verify")]: {
      post: {
        tags: ["Auth"],
        summary: "Verify a forgot password OTP",
        requestBody: createJsonRequestBody(
          "OTP verification payload",
          { $ref: "#/components/schemas/VerifyForgotPasswordOtpRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "OTP verified successfully.",
            "OTP verified successfully.",
            { $ref: "#/components/schemas/AuthResponseData" },
          ),
          "400": createErrorResponse(
            "Validation error.",
            "otpCode must be a 6-digit code.",
          ),
          "403": createErrorResponse(
            "Invalid or expired OTP.",
            "OTP is invalid or expired.",
          ),
        },
      },
    },
    [createApiPath("/auth/temporary-password/{recoveryRequestId}")]: {
      get: {
        tags: ["Auth"],
        summary: "Validate a temporary password session",
        security: bearerSecurity,
        parameters: [
          {
            name: "recoveryRequestId",
            in: "path",
            required: true,
            schema: { type: "number" },
          },
        ],
        responses: {
          "200": createSuccessResponse(
            "Temporary password session is valid.",
            "Temporary password session is valid.",
            { $ref: "#/components/schemas/TemporaryPasswordSessionData" },
          ),
          "403": createErrorResponse(
            "Temporary password session is invalid or expired.",
            "Temporary password session is invalid or expired.",
          ),
        },
      },
    },
    [createApiPath("/auth/temporary-password")]: {
      put: {
        tags: ["Auth"],
        summary: "Complete a temporary password login",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Temporary password completion payload",
          { $ref: "#/components/schemas/CompleteTemporaryPasswordRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "Password changed successfully.",
            "Password changed successfully.",
            { $ref: "#/components/schemas/AuthResponseData" },
          ),
          "400": createErrorResponse(
            "Validation error.",
            "confirmNewPassword must match newPassword.",
          ),
          "403": createErrorResponse(
            "Temporary password session is invalid or expired.",
            "Temporary password session is invalid or expired.",
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
