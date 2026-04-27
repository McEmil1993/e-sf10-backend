import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { rbacController } from "./rbac.controller";

const rbacRouter = Router();

rbacRouter.use(authMiddleware);

rbacRouter.get("/modules", asyncHandler(rbacController.listModules));
rbacRouter.post("/modules", asyncHandler(rbacController.createModule));
rbacRouter.get("/modules/:id", asyncHandler(rbacController.getModuleById));
rbacRouter.put("/modules/:id", asyncHandler(rbacController.updateModule));
rbacRouter.delete("/modules/:id", asyncHandler(rbacController.deleteModule));

rbacRouter.get("/permissions", asyncHandler(rbacController.listPermissions));
rbacRouter.post("/permissions", asyncHandler(rbacController.createPermission));
rbacRouter.get("/permissions/:id", asyncHandler(rbacController.getPermissionById));
rbacRouter.put("/permissions/:id", asyncHandler(rbacController.updatePermission));
rbacRouter.delete("/permissions/:id", asyncHandler(rbacController.deletePermission));

rbacRouter.get("/roles", asyncHandler(rbacController.listRoles));
rbacRouter.post("/roles", asyncHandler(rbacController.createRole));
rbacRouter.get("/roles/:roleId/permissions", asyncHandler(rbacController.getRolePermissions));
rbacRouter.put("/roles/:roleId/permissions", asyncHandler(rbacController.replaceRolePermissions));
rbacRouter.get("/roles/:id", asyncHandler(rbacController.getRoleById));
rbacRouter.put("/roles/:id", asyncHandler(rbacController.updateRole));
rbacRouter.delete("/roles/:id", asyncHandler(rbacController.deleteRole));

rbacRouter.get("/users/:userId/access", asyncHandler(rbacController.getUserAccessProfile));
rbacRouter.get("/users/:userId/roles", asyncHandler(rbacController.getUserRoles));
rbacRouter.put("/users/:userId/roles", asyncHandler(rbacController.replaceUserRoles));
rbacRouter.get(
  "/users/:userId/permissions/overrides",
  asyncHandler(rbacController.getUserPermissionOverrides),
);
rbacRouter.put(
  "/users/:userId/permissions/overrides",
  asyncHandler(rbacController.replaceUserPermissionOverrides),
);

export default rbacRouter;
