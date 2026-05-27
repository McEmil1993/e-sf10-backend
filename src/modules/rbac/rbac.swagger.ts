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
  "Resource not found.",
  "Resource not found.",
);

const duplicateResponse = createErrorResponse(
  "Conflict error.",
  "Role name already exists.",
);

export const rbacSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "RBAC Modules",
      description: "CRUD endpoints for RBAC modules.",
    },
    {
      name: "RBAC Permissions",
      description: "CRUD endpoints for RBAC permissions.",
    },
    {
      name: "RBAC Roles",
      description: "CRUD endpoints for RBAC roles and role permissions.",
    },
    {
      name: "RBAC Users",
      description: "User role assignment, permission overrides, and access profile endpoints.",
    },
  ],
  schemas: {
    RbacModuleResponse: {
      type: "object",
      required: ["id", "name", "slug", "icon", "sortOrder", "createdAt", "updatedAt"],
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Student Management" },
        slug: { type: "string", example: "student" },
        icon: { type: "string", nullable: true, example: "users" },
        sortOrder: { type: "integer", example: 1 },
        createdAt: { type: "string", format: "date-time", example: "2026-04-01T09:00:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-04-01T09:00:00.000Z" },
      },
    },
    CreateRbacModuleRequest: {
      type: "object",
      required: ["name", "slug", "sortOrder"],
      properties: {
        name: { type: "string", example: "Student Management" },
        slug: { type: "string", example: "student" },
        icon: { type: "string", nullable: true, example: "users" },
        sortOrder: { type: "integer", example: 1 },
      },
    },
    PermissionResponse: {
      type: "object",
      required: [
        "id",
        "moduleId",
        "moduleName",
        "moduleSlug",
        "moduleIcon",
        "moduleSortOrder",
        "name",
        "slug",
        "description",
        "createdAt",
        "updatedAt",
      ],
      properties: {
        id: { type: "integer", example: 1 },
        moduleId: { type: "integer", example: 1 },
        moduleName: { type: "string", example: "Student Management" },
        moduleSlug: { type: "string", example: "student" },
        moduleIcon: { type: "string", nullable: true, example: "users" },
        moduleSortOrder: { type: "integer", example: 1 },
        name: { type: "string", example: "View Students" },
        slug: { type: "string", example: "student.view" },
        description: { type: "string", nullable: true, example: "Access the student listing and profiles." },
        createdAt: { type: "string", format: "date-time", example: "2026-04-01T10:00:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-04-01T10:00:00.000Z" },
      },
    },
    PermissionModuleIdInput: {
      type: "integer",
      example: 1,
      description:
        "Select the RBAC module where this permission belongs. Options are loaded from active RBAC modules.",
    },
    CreatePermissionRequest: {
      type: "object",
      required: ["moduleId", "name", "slug"],
      properties: {
        moduleId: { $ref: "#/components/schemas/PermissionModuleIdInput" },
        name: { type: "string", example: "View Students" },
        slug: { type: "string", example: "student.view" },
        description: { type: "string", nullable: true, example: "Access the student listing and profiles." },
      },
    },
    RoleResponse: {
      type: "object",
      required: ["id", "name", "description", "createdAt", "updatedAt"],
      properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "admin" },
        description: {
          type: "string",
          nullable: true,
          example: "Full access to all modules and configuration.",
        },
        createdAt: { type: "string", format: "date-time", example: "2026-04-01T08:00:00.000Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-04-01T08:00:00.000Z" },
      },
    },
    CreateRoleRequest: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", example: "teacher" },
        description: {
          type: "string",
          nullable: true,
          example: "Can manage student records, grades, and related workflows.",
        },
      },
    },
    ReplaceRolePermissionsRequest: {
      type: "object",
      required: ["permissionIds"],
      properties: {
        permissionIds: {
          type: "array",
          items: { type: "integer" },
          example: [1, 3, 4, 5, 6, 7],
        },
      },
    },
    ReplaceUserRolesRequest: {
      type: "object",
      required: ["roleIds"],
      properties: {
        roleIds: {
          type: "array",
          items: { type: "integer" },
          example: [2, 3],
        },
      },
    },
    PermissionOverrideResponse: {
      allOf: [
        { $ref: "#/components/schemas/PermissionResponse" },
        {
          type: "object",
          required: ["userId", "type"],
          properties: {
            userId: { type: "integer", example: 2 },
            type: { type: "string", enum: ["allow", "deny"], example: "allow" },
          },
        },
      ],
    },
    ReplaceUserPermissionOverridesRequest: {
      type: "object",
      required: ["overrides"],
      properties: {
        overrides: {
          type: "array",
          items: {
            type: "object",
            required: ["permissionId", "type"],
            properties: {
              permissionId: { type: "integer", example: 9 },
              type: { type: "string", enum: ["allow", "deny"], example: "allow" },
            },
          },
        },
      },
    },
    UserAccessProfileResponse: {
      type: "object",
      required: ["userId", "roles", "permissions", "permissionSlugs", "allowOverrides", "denyOverrides"],
      properties: {
        userId: { type: "integer", example: 2 },
        roles: {
          type: "array",
          items: { $ref: "#/components/schemas/RoleResponse" },
        },
        permissions: {
          type: "array",
          items: { $ref: "#/components/schemas/PermissionResponse" },
        },
        permissionSlugs: {
          type: "array",
          items: { type: "string" },
          example: ["student.view", "grades.view", "reports.export"],
        },
        allowOverrides: {
          type: "array",
          items: { type: "string" },
          example: ["reports.export"],
        },
        denyOverrides: {
          type: "array",
          items: { type: "string" },
          example: ["grades.encode"],
        },
      },
    },
  },
  paths: {
    [createApiPath("/rbac/modules")]: {
      get: {
        tags: ["RBAC Modules"],
        summary: "List RBAC modules",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("RBAC modules fetched.", "RBAC modules fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/RbacModuleResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["RBAC Modules"],
        summary: "Create RBAC module",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "RBAC module payload",
          { $ref: "#/components/schemas/CreateRbacModuleRequest" },
        ),
        responses: {
          "201": createSuccessResponse("RBAC module created.", "RBAC module created successfully.", {
            $ref: "#/components/schemas/RbacModuleResponse",
          }),
          "401": unauthorizedResponse,
          "409": duplicateResponse,
        },
      },
    },
    [createApiPath("/rbac/modules/{id}")]: {
      get: {
        tags: ["RBAC Modules"],
        summary: "Get RBAC module by ID",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("RBAC module fetched.", "RBAC module fetched successfully.", {
            $ref: "#/components/schemas/RbacModuleResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["RBAC Modules"],
        summary: "Update RBAC module",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        requestBody: createJsonRequestBody(
          "RBAC module payload",
          { $ref: "#/components/schemas/CreateRbacModuleRequest" },
        ),
        responses: {
          "200": createSuccessResponse("RBAC module updated.", "RBAC module updated successfully.", {
            $ref: "#/components/schemas/RbacModuleResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "409": duplicateResponse,
        },
      },
      delete: {
        tags: ["RBAC Modules"],
        summary: "Soft delete RBAC module",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("RBAC module soft deleted.", "RBAC module soft deleted successfully."),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
    [createApiPath("/rbac/permissions")]: {
      get: {
        tags: ["RBAC Permissions"],
        summary: "List permissions",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Permissions fetched.", "Permissions fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/PermissionResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["RBAC Permissions"],
        summary: "Create permission",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Permission payload",
          { $ref: "#/components/schemas/CreatePermissionRequest" },
        ),
        responses: {
          "201": createSuccessResponse("Permission created.", "Permission created successfully.", {
            $ref: "#/components/schemas/PermissionResponse",
          }),
          "401": unauthorizedResponse,
          "404": createErrorResponse("Module not found.", "Module not found."),
          "409": createErrorResponse("Permission slug already exists.", "Permission slug already exists."),
        },
      },
    },
    [createApiPath("/rbac/permissions/{id}")]: {
      get: {
        tags: ["RBAC Permissions"],
        summary: "Get permission by ID",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Permission fetched.", "Permission fetched successfully.", {
            $ref: "#/components/schemas/PermissionResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["RBAC Permissions"],
        summary: "Update permission",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        requestBody: createJsonRequestBody(
          "Permission payload",
          { $ref: "#/components/schemas/CreatePermissionRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Permission updated.", "Permission updated successfully.", {
            $ref: "#/components/schemas/PermissionResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "409": createErrorResponse("Permission slug already exists.", "Permission slug already exists."),
        },
      },
      delete: {
        tags: ["RBAC Permissions"],
        summary: "Soft delete permission",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Permission soft deleted.", "Permission soft deleted successfully."),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
    [createApiPath("/rbac/roles")]: {
      get: {
        tags: ["RBAC Roles"],
        summary: "List roles",
        security: bearerSecurity,
        responses: {
          "200": createSuccessResponse("Roles fetched.", "Roles fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/RoleResponse" },
          }),
          "401": unauthorizedResponse,
        },
      },
      post: {
        tags: ["RBAC Roles"],
        summary: "Create role",
        security: bearerSecurity,
        requestBody: createJsonRequestBody(
          "Role payload",
          { $ref: "#/components/schemas/CreateRoleRequest" },
        ),
        responses: {
          "201": createSuccessResponse("Role created.", "Role created successfully.", {
            $ref: "#/components/schemas/RoleResponse",
          }),
          "401": unauthorizedResponse,
          "409": createErrorResponse("Role name already exists.", "Role name already exists."),
        },
      },
    },
    [createApiPath("/rbac/roles/{id}")]: {
      get: {
        tags: ["RBAC Roles"],
        summary: "Get role by ID",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Role fetched.", "Role fetched successfully.", {
            $ref: "#/components/schemas/RoleResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["RBAC Roles"],
        summary: "Update role",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        requestBody: createJsonRequestBody(
          "Role payload",
          { $ref: "#/components/schemas/CreateRoleRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Role updated.", "Role updated successfully.", {
            $ref: "#/components/schemas/RoleResponse",
          }),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
          "409": createErrorResponse("Role name already exists.", "Role name already exists."),
        },
      },
      delete: {
        tags: ["RBAC Roles"],
        summary: "Soft delete role",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "id", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Role soft deleted.", "Role soft deleted successfully."),
          "401": unauthorizedResponse,
          "404": notFoundResponse,
        },
      },
    },
    [createApiPath("/rbac/roles/{roleId}/permissions")]: {
      get: {
        tags: ["RBAC Roles"],
        summary: "Get role permissions",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "roleId", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("Role permissions fetched.", "Role permissions fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/PermissionResponse" },
          }),
          "401": unauthorizedResponse,
          "404": createErrorResponse("Role not found.", "Role not found."),
        },
      },
      put: {
        tags: ["RBAC Roles"],
        summary: "Replace role permissions",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "roleId", required: true, schema: { type: "integer" } },
        ],
        requestBody: createJsonRequestBody(
          "Replace role permission payload",
          { $ref: "#/components/schemas/ReplaceRolePermissionsRequest" },
        ),
        responses: {
          "200": createSuccessResponse("Role permissions updated.", "Role permissions updated successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/PermissionResponse" },
          }),
          "401": unauthorizedResponse,
          "404": createErrorResponse("Role or permission not found.", "Role not found."),
        },
      },
    },
    [createApiPath("/rbac/users/{userId}/access")]: {
      get: {
        tags: ["RBAC Users"],
        summary: "Get user access profile",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "userId", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("User access profile fetched.", "User access profile fetched successfully.", {
            $ref: "#/components/schemas/UserAccessProfileResponse",
          }),
          "401": unauthorizedResponse,
          "404": createErrorResponse("User not found.", "User not found."),
        },
      },
    },
    [createApiPath("/rbac/users/{userId}/roles")]: {
      get: {
        tags: ["RBAC Users"],
        summary: "Get user roles",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "userId", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse("User roles fetched.", "User roles fetched successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/RoleResponse" },
          }),
          "401": unauthorizedResponse,
          "404": createErrorResponse("User not found.", "User not found."),
        },
      },
      put: {
        tags: ["RBAC Users"],
        summary: "Replace user roles",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "userId", required: true, schema: { type: "integer" } },
        ],
        requestBody: createJsonRequestBody(
          "Replace user role payload",
          { $ref: "#/components/schemas/ReplaceUserRolesRequest" },
        ),
        responses: {
          "200": createSuccessResponse("User roles updated.", "User roles updated successfully.", {
            type: "array",
            items: { $ref: "#/components/schemas/RoleResponse" },
          }),
          "401": unauthorizedResponse,
          "404": createErrorResponse("User or role not found.", "User not found."),
        },
      },
    },
    [createApiPath("/rbac/users/{userId}/permissions/overrides")]: {
      get: {
        tags: ["RBAC Users"],
        summary: "Get user permission overrides",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "userId", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": createSuccessResponse(
            "User permission overrides fetched.",
            "User permission overrides fetched successfully.",
            {
              type: "array",
              items: { $ref: "#/components/schemas/PermissionOverrideResponse" },
            },
          ),
          "401": unauthorizedResponse,
          "404": createErrorResponse("User not found.", "User not found."),
        },
      },
      put: {
        tags: ["RBAC Users"],
        summary: "Replace user permission overrides",
        security: bearerSecurity,
        parameters: [
          { in: "path", name: "userId", required: true, schema: { type: "integer" } },
        ],
        requestBody: createJsonRequestBody(
          "Replace user permission overrides payload",
          { $ref: "#/components/schemas/ReplaceUserPermissionOverridesRequest" },
        ),
        responses: {
          "200": createSuccessResponse(
            "User permission overrides updated.",
            "User permission overrides updated successfully.",
            {
              type: "array",
              items: { $ref: "#/components/schemas/PermissionOverrideResponse" },
            },
          ),
          "401": unauthorizedResponse,
          "404": createErrorResponse("User or permission not found.", "User not found."),
        },
      },
    },
  },
};
