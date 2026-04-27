import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { backupController } from "./backup.controller";
import { backupUploadMiddleware } from "./backup.middleware";

const backupRouter = Router();

backupRouter.use(authMiddleware);
backupRouter.get("/", asyncHandler(backupController.listBackups));
backupRouter.post("/export", asyncHandler(backupController.exportBackup));
backupRouter.get("/files/:filename/download", asyncHandler(backupController.downloadBackup));
backupRouter.post("/files/:filename/import", asyncHandler(backupController.importStoredBackup));
backupRouter.post(
  "/import",
  backupUploadMiddleware.single("file"),
  asyncHandler(backupController.importBackup),
);

export default backupRouter;
