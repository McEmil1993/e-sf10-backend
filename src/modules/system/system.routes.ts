import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { systemController } from "./system.controller";

const systemRouter = Router();

systemRouter.use(authMiddleware);

systemRouter.get("/school", asyncHandler(systemController.getSchool));
systemRouter.put("/school", asyncHandler(systemController.updateSchool));

export default systemRouter;
