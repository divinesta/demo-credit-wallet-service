import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { createUserAccount } from "../controllers/user.controller";
import { validate } from "../middlewares/validation.middleware";
import { createUserSchema } from "../utils/validation";

export const userRouter = Router();

userRouter.post("/", validate(createUserSchema), asyncHandler(createUserAccount));
