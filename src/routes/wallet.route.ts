import { Router } from "express";

import { fundUserWallet, withdrawUserWallet } from "../controllers/wallet.controller";
import { fundWalletSchema, withdrawWalletSchema } from "../utils/validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/async-handler";

export const walletRouter = Router();

walletRouter.post(
   "/fund", 
   authMiddleware, 
   validate(fundWalletSchema), 
   asyncHandler(fundUserWallet)
);

walletRouter.post(
   "/withdraw",
   authMiddleware,
   validate(withdrawWalletSchema),
   asyncHandler(withdrawUserWallet)
);