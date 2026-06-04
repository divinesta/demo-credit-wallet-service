import { Router } from "express";

import { fundUserWallet, getMyWallet, withdrawUserWallet, transferFromUserWallet } from "../controllers/wallet.controller";
import { fundWalletSchema, withdrawWalletSchema, transferWalletSchema } from "../utils/validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { asyncHandler } from "../utils/async-handler";

export const walletRouter = Router();

walletRouter.get(
   "/me",
   authMiddleware,
   asyncHandler(getMyWallet)
);

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

walletRouter.post(
   "/transfer",
   authMiddleware,
   validate(transferWalletSchema),
   asyncHandler(transferFromUserWallet)
);
