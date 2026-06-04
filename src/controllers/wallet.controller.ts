import { Response } from "express";

import { fundWallet, getCurrentUserWallet, withdrawWallet, transferWallet } from "../services/wallet.service";
import { AuthenticatedRequest } from "../utils/types";

export const getMyWallet = async (req: AuthenticatedRequest, res: Response) => {
   const wallet = await getCurrentUserWallet(req.user.id);

   res.status(200).json({
      message: "Wallet retrieved successfully",
      data: wallet,
   });
};

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

export const transferFromUserWallet = async (req: AuthenticatedRequest, res: Response) => {
   const result = await transferWallet(
      req.user.id,
      req.body.receiverUserId,
      req.body.amount
   );

   res.status(200).json({
      message: "Wallet transfer successful",
      data: result,
   });
};
