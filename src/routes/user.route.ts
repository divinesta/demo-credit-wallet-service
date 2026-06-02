import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { createUserAccount } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.post("/", asyncHandler(createUserAccount));
