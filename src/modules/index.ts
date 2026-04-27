import type { Router } from "express";

import type { SwaggerModule } from "../docs/swagger.types";
import authRouter from "./auth/auth.routes";
import { authSwaggerModule } from "./auth/auth.swagger";
import { backupRouter } from "./backup";
import { backupSwaggerModule } from "./backup/backup.swagger";
import { positionRouter } from "./position";
import { positionSwaggerModule } from "./position/position.swagger";
import pupilRouter from "./pupil/pupil.routes";
import { pupilSwaggerModule } from "./pupil/pupil.swagger";
import { rbacRouter } from "./rbac";
import { rbacSwaggerModule } from "./rbac/rbac.swagger";
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
    name: "backups",
    route: "/backups",
    router: backupRouter,
    swagger: backupSwaggerModule,
  },
  {
    name: "pupils",
    route: "/pupils",
    router: pupilRouter,
    swagger: pupilSwaggerModule,
  },
  {
    name: "positions",
    route: "/positions",
    router: positionRouter,
    swagger: positionSwaggerModule,
  },
  {
    name: "uploads",
    route: "/uploads",
    router: uploadRouter,
    swagger: uploadSwaggerModule,
  },
  {
    name: "rbac",
    route: "/rbac",
    router: rbacRouter,
    swagger: rbacSwaggerModule,
  }
];
