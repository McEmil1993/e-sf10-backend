import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { uploadController } from "./upload.controller";
import { uploadMiddleware } from "./upload.middleware";

const uploadRouter = Router();

uploadRouter.use(authMiddleware);
uploadRouter.get("/config", asyncHandler(uploadController.getUploadConfig));
uploadRouter.get("/files", asyncHandler(uploadController.listFiles));
uploadRouter.get("/files/:category/:filename/view", asyncHandler(uploadController.viewFile));
uploadRouter.delete("/files/:category/:filename", asyncHandler(uploadController.deleteFile));
uploadRouter.post("/single", uploadMiddleware.single("file"), asyncHandler(uploadController.uploadSingle));
uploadRouter.post(
  "/multiple",
  uploadMiddleware.array("files"),
  asyncHandler(uploadController.uploadMultiple),
);

export default uploadRouter;
