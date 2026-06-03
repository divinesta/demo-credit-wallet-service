import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/types";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
   const token = req.headers.authorization?.replace("Bearer ", "");
   const userId = Number(token);

   if (!token || Number.isNaN(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   (req as AuthenticatedRequest).user = { id: userId };
   next();
};