import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { studentController } from "./student.controller";

const studentRouter = Router();

studentRouter.use(authMiddleware);

studentRouter.get("/lookups", asyncHandler(studentController.getStudentInformationLookups));
studentRouter.get("/", asyncHandler(studentController.getAllStudents));
studentRouter.post("/", asyncHandler(studentController.createStudent));
studentRouter.get("/:id/information", asyncHandler(studentController.getStudentInformation));
studentRouter.put("/:id/information", asyncHandler(studentController.updateStudentInformation));
studentRouter.get("/:id/guardians", asyncHandler(studentController.getStudentGuardians));
studentRouter.post("/:id/guardians", asyncHandler(studentController.createStudentGuardian));
studentRouter.put("/:id/guardians/:relationId", asyncHandler(studentController.updateStudentGuardian));
studentRouter.delete("/:id/guardians/:relationId", asyncHandler(studentController.deleteStudentGuardian));
studentRouter.get("/:id", asyncHandler(studentController.getStudentById));
studentRouter.put("/:id", asyncHandler(studentController.updateStudent));
studentRouter.delete("/:id", asyncHandler(studentController.deleteStudent));

export default studentRouter;
