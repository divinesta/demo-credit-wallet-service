import { Response } from "express";

import { fundWallet, withdrawWallet } from "../services/wallet.service";
import { AuthenticatedRequest } from "../utils/types";

export const fundUserWallet = async (req: AuthenticatedRequest, res:Response) => {
   const result = await fundWallet(req.user.id, req.body.amount);

   res.status(200).json({
      message: "Wallet funded successfully",
      data: result,
   });
};

export const withdrawUserWallet = async (req: AuthenticatedRequest, res: Response) => {
   const result = await withdrawWallet(req.user.id, req.body.amount);

   res.status(200).json({
      message: "Wallet withdrawal successful",
      data: result
   });
};