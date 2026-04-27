import { Router } from "express";

import { authMiddleware } from "../../common/middleware/auth.middleware";
import { asyncHandler } from "../../common/utils/async-handler";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/", asyncHandler(userController.getAllUsers));
userRouter.post("/", asyncHandler(userController.createUser));
userRouter.get("/me", asyncHandler(userController.getCurrentUser));
userRouter.put("/me", asyncHandler(userController.updateCurrentUser));
userRouter.put("/me/password", asyncHandler(userController.changeCurrentPassword));
userRouter.get("/:id", asyncHandler(userController.getUserById));
userRouter.put("/:id", asyncHandler(userController.updateUser));
userRouter.delete("/:id", asyncHandler(userController.deleteUser));

export default userRouter;
