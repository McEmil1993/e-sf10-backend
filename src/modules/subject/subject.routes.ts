import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { subjectController } from "./subject.controller";

const subjectRouter = Router();

subjectRouter.use(authMiddleware);

subjectRouter.get("/", asyncHandler(subjectController.getAllSubjects));
subjectRouter.post("/", asyncHandler(subjectController.createSubject));
subjectRouter.get("/:id", asyncHandler(subjectController.getSubjectById));
subjectRouter.put("/:id", asyncHandler(subjectController.updateSubject));
subjectRouter.delete("/:id", asyncHandler(subjectController.deleteSubject));

export default subjectRouter;
