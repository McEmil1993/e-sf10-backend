import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { positionController } from "./position.controller";

const positionRouter = Router();

positionRouter.use(authMiddleware);

positionRouter.get("/", asyncHandler(positionController.getAllPositions));
positionRouter.post("/", asyncHandler(positionController.createPosition));
positionRouter.get("/:id", asyncHandler(positionController.getPositionById));
positionRouter.put("/:id", asyncHandler(positionController.updatePosition));
positionRouter.delete("/:id", asyncHandler(positionController.deletePosition));

export default positionRouter;
