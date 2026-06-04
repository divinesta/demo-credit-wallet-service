import { Router } from "express";

import { fundUserWallet } from "../controllers/wallet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/async-handler";
import { fundWalletSchema } from "../utils/validation";

export const walletRouter = Router();

walletRouter.post(
   "/fund", 
   authMiddleware, 
   validate(fundWalletSchema), 
   asyncHandler(fundUserWallet)
);