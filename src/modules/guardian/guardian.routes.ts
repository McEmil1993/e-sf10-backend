import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { guardianController } from "./guardian.controller";

const guardianRouter = Router();

guardianRouter.use(authMiddleware);

guardianRouter.get("/", asyncHandler(guardianController.getAllGuardians));
guardianRouter.post("/", asyncHandler(guardianController.createGuardian));
guardianRouter.get("/:id", asyncHandler(guardianController.getGuardianById));
guardianRouter.put("/:id", asyncHandler(guardianController.updateGuardian));
guardianRouter.delete("/:id", asyncHandler(guardianController.deleteGuardian));

export default guardianRouter;
