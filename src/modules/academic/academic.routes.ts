import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { academicController } from "./academic.controller";

const academicRouter = Router();

academicRouter.use(authMiddleware);

academicRouter.get("/:entity", asyncHandler(academicController.list));
academicRouter.post("/:entity", asyncHandler(academicController.create));
academicRouter.get("/:entity/:id", asyncHandler(academicController.getById));
academicRouter.put("/:entity/:id", asyncHandler(academicController.update));
academicRouter.delete("/:entity/:id", asyncHandler(academicController.delete));

export default academicRouter;
