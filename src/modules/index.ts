import type { Router } from "express";

import type { SwaggerModule } from "../docs/swagger.types";
import { academicRouter, academicSwaggerModule } from "./academic";
import authRouter from "./auth/auth.routes";
import { authSwaggerModule } from "./auth/auth.swagger";
import { backupRouter } from "./backup";
import { backupSwaggerModule } from "./backup/backup.swagger";
import guardianRouter from "./guardian/guardian.routes";
import { guardianSwaggerModule } from "./guardian/guardian.swagger";
import { positionRouter } from "./position";
import { positionSwaggerModule } from "./position/position.swagger";
import studentRouter from "./student/student.routes";
import { studentSwaggerModule } from "./student/student.swagger";
import { rbacRouter } from "./rbac";
import { rbacSwaggerModule } from "./rbac/rbac.swagger";
import { systemRouter } from "./system";
import { systemSwaggerModule } from "./system/system.swagger";
import { subjectRouter } from "./subject";
import { subjectSwaggerModule } from "./subject/subject.swagger";
import uploadRouter from "./upload/upload.routes";
import { uploadSwaggerModule } from "./upload/upload.swagger";
import userRouter from "./user/user.routes";
import { userSwaggerModule } from "./user/user.swagger";

export interface ApiModuleDefinition {
  name: string;
  route: string;
  router: Router;
  swagger: SwaggerModule;
}

export const apiModules: ApiModuleDefinition[] = [
  {
    name: "auth",
    route: "/auth",
    router: authRouter,
    swagger: authSwaggerModule,
  },
  {
    name: "users",
    route: "/users",
    router: userRouter,
    swagger: userSwaggerModule,
  },
  {
    name: "guardians",
    route: "/guardians",
    router: guardianRouter,
    swagger: guardianSwaggerModule,
  },
  {
    name: "backups",
    route: "/backups",
    router: backupRouter,
    swagger: backupSwaggerModule,
  },
  {
    name: "students",
    route: "/students",
    router: studentRouter,
    swagger: studentSwaggerModule,
  },
  {
    name: "academic",
    route: "/academic",
    router: academicRouter,
    swagger: academicSwaggerModule,
  },
  {
    name: "positions",
    route: "/positions",
    router: positionRouter,
    swagger: positionSwaggerModule,
  },
  {
    name: "subjects",
    route: "/subjects",
    router: subjectRouter,
    swagger: subjectSwaggerModule,
  },
  {
    name: "uploads",
    route: "/uploads",
    router: uploadRouter,
    swagger: uploadSwaggerModule,
  },
  {
    name: "system",
    route: "/system",
    router: systemRouter,
    swagger: systemSwaggerModule,
  },
  {
    name: "rbac",
    route: "/rbac",
    router: rbacRouter,
    swagger: rbacSwaggerModule,
  }
];
