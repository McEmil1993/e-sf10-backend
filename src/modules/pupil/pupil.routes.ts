import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { pupilController } from "./pupil.controller";

const pupilRouter = Router();

pupilRouter.use(authMiddleware);

pupilRouter.get("/", asyncHandler(pupilController.getAllPupils));
pupilRouter.post("/", asyncHandler(pupilController.createPupil));
pupilRouter.get("/:id/guardians", asyncHandler(pupilController.getPupilGuardians));
pupilRouter.post("/:id/guardians", asyncHandler(pupilController.createPupilGuardian));
pupilRouter.put("/:id/guardians/:relationId", asyncHandler(pupilController.updatePupilGuardian));
pupilRouter.delete("/:id/guardians/:relationId", asyncHandler(pupilController.deletePupilGuardian));
pupilRouter.get("/:id", asyncHandler(pupilController.getPupilById));
pupilRouter.put("/:id", asyncHandler(pupilController.updatePupil));
pupilRouter.delete("/:id", asyncHandler(pupilController.deletePupil));

export default pupilRouter;
