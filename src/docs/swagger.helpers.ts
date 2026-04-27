import { API_PREFIX } from "../config/constants";
import type { SwaggerModule, SwaggerTag } from "./swagger.types";

export const createApiPath = (path: string): string => {
  if (path === "/") {
    return API_PREFIX;
  }

  return `${API_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
};

export const createJsonRequestBody = (
  description: string,
  schema: unknown,
  required = true,
): Record<string, unknown> => {
  return {
    required,
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
};

export const createMultipartRequestBody = (
  description: string,
  schema: unknown,
  required = true,
): Record<string, unknown> => {
  return {
    required,
    description,
    content: {
      "multipart/form-data": {
        schema,
      },
    },
  };
};

const createEnvelopeSchema = (
  success: boolean,
  messageExample: string,
  dataSchema?: unknown,
  errorsSchema?: unknown,
): Record<string, unknown> => {
  const properties: Record<string, unknown> = {
    success: {
      type: "boolean",
      example: success,
    },
    message: {
      type: "string",
      example: messageExample,
    },
  };

  const required = ["success", "message"];

  if (dataSchema !== undefined) {
    properties.data = dataSchema;
    required.push("data");
  }

  if (errorsSchema !== undefined) {
    properties.errors = errorsSchema;
  }

  return {
    type: "object",
    properties,
    required,
  };
};

export const createSuccessResponse = (
  description: string,
  messageExample: string,
  dataSchema?: unknown,
): Record<string, unknown> => {
  return {
    description,
    content: {
      "application/json": {
        schema: createEnvelopeSchema(true, messageExample, dataSchema),
      },
    },
  };
};

export const createErrorResponse = (
  description: string,
  messageExample: string,
  errorsSchema?: unknown,
): Record<string, unknown> => {
  return {
    description,
    content: {
      "application/json": {
        schema: createEnvelopeSchema(false, messageExample, undefined, errorsSchema),
      },
    },
  };
};

export const bearerSecurity = [{ bearerAuth: [] }];

export const mergeSwaggerModules = (modules: SwaggerModule[]): SwaggerModule => {
  const tags = new Map<string, SwaggerTag>();
  const schemas: Record<string, unknown> = {};
  const paths: Record<string, unknown> = {};

  for (const swaggerModule of modules) {
    for (const tag of swaggerModule.tags ?? []) {
      tags.set(tag.name, tag);
    }

    Object.assign(schemas, swaggerModule.schemas);
    Object.assign(paths, swaggerModule.paths);
  }

  return {
    tags: Array.from(tags.values()),
    schemas,
    paths,
  };
};
