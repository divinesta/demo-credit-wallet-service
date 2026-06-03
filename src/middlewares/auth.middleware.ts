import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../utils/types";

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   const token = req.headers.authorization?.replace("Bearer ", "");
   const userId = Number(token);

   if (!token || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   req.user = { id: userId };
   next();
};