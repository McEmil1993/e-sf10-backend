import type { Application } from "express";
import swaggerUi from "swagger-ui-express";

import { env } from "../config/env";
import { API_PREFIX } from "../config/constants";
import { apiModules } from "../modules";
import type { AccessModuleRecord } from "../modules/rbac";
import { rbacRepository } from "../modules/rbac";
import {
  createApiPath,
  createErrorResponse,
  createSuccessResponse,
  mergeSwaggerModules,
} from "./swagger.helpers";

const mergedSwaggerModules = mergeSwaggerModules(apiModules.map((moduleItem) => moduleItem.swagger));

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const buildPermissionRequestExamples = (
  modules: AccessModuleRecord[],
): Record<string, unknown> | undefined => {
  if (modules.length === 0) {
    return undefined;
  }

  return Object.fromEntries(
    modules.map((moduleItem) => {
      const usesCanPrefix = moduleItem.slug === "user";
      const exampleName = usesCanPrefix ? "Can View" : `View ${moduleItem.name}`;
      const exampleSlug = usesCanPrefix ? `${moduleItem.slug}.can_view` : `${moduleItem.slug}.view`;
      const exampleDescription = usesCanPrefix
        ? `Allow access to the ${moduleItem.name.toLowerCase()} listing and profile details.`
        : `Access the ${moduleItem.name.toLowerCase()} listing and profiles.`;

      return [
        `${moduleItem.name} (${moduleItem.id})`,
        {
          summary: `${moduleItem.name} permission`,
          value: {
            moduleId: moduleItem.id,
            name: exampleName,
            slug: exampleSlug,
            description: exampleDescription,
          },
        },
      ];
    }),
  );
};

const buildPermissionModuleIdSchema = (modules: AccessModuleRecord[]): Record<string, unknown> => {
  if (modules.length === 0) {
    return {
      type: "integer",
      example: 1,
      description:
        "RBAC module ID. Create a module first or use GET /api/rbac/modules to view active modules.",
    };
  }

  const optionDescriptions = modules.map((moduleItem) => {
    return `${moduleItem.id} = ${moduleItem.name} (${moduleItem.slug})`;
  });

  return {
    type: "integer",
    enum: modules.map((moduleItem) => moduleItem.id),
    example: modules[0]?.id ?? 1,
    description: [
      "Select the RBAC module where this permission belongs.",
      "Available module IDs:",
      ...optionDescriptions,
    ].join("\n"),
    "x-enumNames": modules.map((moduleItem) => `${moduleItem.name} (${moduleItem.slug})`),
  };
};

const applyPermissionExamples = (
  paths: Record<string, unknown>,
  examples: Record<string, unknown> | undefined,
): void => {
  if (!examples) {
    return;
  }

  const permissionPaths = [
    [createApiPath("/rbac/permissions"), "post"],
    [createApiPath("/rbac/permissions/{id}"), "put"],
  ] as const;

  for (const [path, method] of permissionPaths) {
    const pathItem = paths[path];

    if (!isRecord(pathItem)) {
      continue;
    }

    const operation = pathItem[method];

    if (!isRecord(operation)) {
      continue;
    }

    const requestBody = operation.requestBody;

    if (!isRecord(requestBody)) {
      continue;
    }

    const content = requestBody.content;

    if (!isRecord(content)) {
      continue;
    }

    const jsonContent = content["application/json"];

    if (!isRecord(jsonContent)) {
      continue;
    }

    jsonContent.examples = examples;
  }
};

export const buildOpenApiDocument = async (): Promise<Record<string, unknown>> => {
  let modules: AccessModuleRecord[] = [];

  try {
    modules = await rbacRepository.listModules();
  } catch {
    modules = [];
  }

  const permissionModuleIdSchema = buildPermissionModuleIdSchema(modules);
  const permissionRequestExamples = buildPermissionRequestExamples(modules);
  const paths = { ...(mergedSwaggerModules.paths ?? {}) };

  applyPermissionExamples(paths, permissionRequestExamples);

  return {
    openapi: "3.0.3",
    info: {
      title: "Backend v2 API",
      version: "1.0.0",
      description: "Express + TypeScript + MySQL backend with module-based Swagger documentation.",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "System",
        description: "System and health endpoints.",
      },
      ...(mergedSwaggerModules.tags ?? []),
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ...(mergedSwaggerModules.schemas ?? {}),
        PermissionModuleIdInput: permissionModuleIdSchema,
      },
    },
    paths,
  };
};

const systemPaths = {
  "/health": {
    get: {
      tags: ["System"],
      summary: "Health check",
      responses: {
        "200": createSuccessResponse(
          "Server is healthy.",
          "Backend v2 server is running.",
          {
            type: "object",
            required: ["environment"],
            properties: {
              environment: {
                type: "string",
                example: env.NODE_ENV,
              },
            },
          },
        ),
      },
    },
  },
  [API_PREFIX]: {
    get: {
      tags: ["System"],
      summary: "API root",
      responses: {
        "200": createSuccessResponse(
          "API root metadata.",
          "Backend v2 API is ready.",
          {
            type: "object",
            required: ["modules"],
            properties: {
              modules: {
                type: "array",
                items: {
                  type: "string",
                },
                example: apiModules.map((moduleItem) => moduleItem.name),
              },
            },
          },
        ),
      },
    },
  },
};

export const buildSwaggerResponseDocument = async (): Promise<Record<string, unknown>> => {
  const openApiDocument = await buildOpenApiDocument();

  if (!isRecord(openApiDocument.paths)) {
    return openApiDocument;
  }

  openApiDocument.paths = {
    ...systemPaths,
    ...openApiDocument.paths,
  };

  return openApiDocument;
};

export const setupSwagger = (app: Application): void => {
  app.get("/docs.json", async (_request, response, next) => {
    try {
      const openApiDocument = await buildSwaggerResponseDocument();
      response.json(openApiDocument);
    } catch (error) {
      next(error);
    }
  });

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      explorer: true,
      customSiteTitle: "Backend v2 Swagger Docs",
      swaggerOptions: {
        persistAuthorization: true,
        url: "/docs.json",
      },
    }),
  );
};
