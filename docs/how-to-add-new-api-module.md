# How To Add New API Module

This project uses a module registry plus per-module Swagger files para madaling magdagdag ng bagong API module.

## Current important paths

- `src/modules/<module-name>/`
- `src/modules/index.ts`
- `src/routes/index.ts`
- `src/docs/swagger.ts`
- `src/docs/swagger.helpers.ts`
- `http://localhost:5555/docs`
- `http://localhost:5555/docs.json`

## Rule of thumb

For every new module, gawin mo ito:

1. Gumawa ng sariling folder sa `src/modules/<module-name>/`
2. Ilagay ang routes, controller, service, repository, dto, at interface files doon
3. Gumawa ng `src/modules/<module-name>/<module-name>.swagger.ts`
4. I-register ang module sa `src/modules/index.ts`

Kapag naka-register na sa `src/modules/index.ts`, automatic na itong:

- lalabas sa `/api`
- mama-mount sa tamang route
- masasama sa Swagger UI

## Minimum file structure

Example for a `student` module:

```text
src/modules/
└── student/
    ├── student.controller.ts
    ├── student.service.ts
    ├── student.repository.ts
    ├── student.routes.ts
    ├── student.dto.ts
    ├── student.interface.ts
    └── student.swagger.ts
```

## Step 1: Add the route file

Path:

- `src/modules/student/student.routes.ts`

Sample:

```ts
import { Router } from "express";

const studentRouter = Router();

studentRouter.get("/", (_request, response) => {
  response.json({
    success: true,
    message: "Students fetched successfully.",
    data: [
      {
        id: 1,
        name: "Juan Dela Cruz",
      },
    ],
  });
});

studentRouter.post("/", (request, response) => {
  response.status(201).json({
    success: true,
    message: "Student created successfully.",
    data: request.body,
  });
});

export default studentRouter;
```

## Step 2: Add the Swagger file

Path:

- `src/modules/student/student.swagger.ts`

Sample:

```ts
import {
  createApiPath,
  createJsonRequestBody,
  createMultipartRequestBody,
  createSuccessResponse,
} from "../../docs/swagger.helpers";
import type { SwaggerModule } from "../../docs/swagger.types";

export const studentSwaggerModule: SwaggerModule = {
  tags: [
    {
      name: "Students",
      description: "Student management endpoints.",
    },
  ],
  schemas: {
    StudentResponse: {
      type: "object",
      required: ["id", "name"],
      properties: {
        id: {
          type: "integer",
          example: 1,
        },
        name: {
          type: "string",
          example: "Juan Dela Cruz",
        },
      },
    },
    CreateStudentRequest: {
      type: "object",
      required: ["name"],
      properties: {
        name: {
          type: "string",
          example: "Juan Dela Cruz",
        },
      },
    },
  },
  paths: {
    [createApiPath("/students")]: {
      get: {
        tags: ["Students"],
        summary: "Get all students",
        responses: {
          "200": createSuccessResponse(
            "Students fetched successfully.",
            "Students fetched successfully.",
            {
              type: "array",
              items: {
                $ref: "#/components/schemas/StudentResponse",
              },
            },
          ),
        },
      },
      post: {
        tags: ["Students"],
        summary: "Create a new student",
        requestBody: createJsonRequestBody(
          "Student payload",
          { $ref: "#/components/schemas/CreateStudentRequest" },
        ),
        responses: {
          "201": createSuccessResponse(
            "Student created successfully.",
            "Student created successfully.",
            { $ref: "#/components/schemas/StudentResponse" },
          ),
        },
      },
    },
  },
};
```

## Step 3: Register the module

Path:

- `src/modules/index.ts`

Add imports:

```ts
import studentRouter from "./student/student.routes";
import { studentSwaggerModule } from "./student/student.swagger";
```

Add this object inside `apiModules`:

```ts
{
  name: "students",
  route: "/students",
  router: studentRouter,
  swagger: studentSwaggerModule,
}
```

## Step 4: Final result

After registration:

- route URL becomes `GET /api/students`
- Swagger docs appear automatically in `/docs`
- OpenAPI JSON updates automatically in `/docs.json`

## If the module is protected

Sa Swagger file, idagdag ito sa endpoint:

```ts
import { bearerSecurity } from "../../docs/swagger.helpers";
```

```ts
security: bearerSecurity
```

Example:

```ts
[createApiPath("/students/me")]: {
  get: {
    tags: ["Students"],
    summary: "Get current student profile",
    security: bearerSecurity,
    responses: {
      "200": createSuccessResponse(
        "Student profile fetched successfully.",
        "Student profile fetched successfully.",
        { $ref: "#/components/schemas/StudentResponse" },
      ),
    },
  },
}
```

## If the module uploads files

Use `multipart/form-data` in the Swagger file.

Sample:

```ts
[createApiPath("/students/upload-avatar")]: {
  post: {
    tags: ["Students"],
    summary: "Upload student avatar",
    requestBody: createMultipartRequestBody(
      "Upload one image file using the `file` field.",
      {
        type: "object",
        required: ["file"],
        properties: {
          file: {
            type: "string",
            format: "binary",
          },
        },
      },
    ),
    responses: {
      "201": createSuccessResponse(
        "Avatar uploaded successfully.",
        "Avatar uploaded successfully.",
        {
          type: "object",
          properties: {
            publicUrl: {
              type: "string",
              example: "http://localhost:5555/uploads/avatar.png",
            },
          },
        },
      ),
    },
  },
}
```

## Quick checklist

- may folder sa `src/modules/<module-name>/`
- may route file
- may swagger file
- naka-register sa `src/modules/index.ts`
- visible na sa `/docs`
