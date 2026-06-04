import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";

export const errorMiddleware = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
   const statusCode = error instanceof AppError ? error.statusCode : 500;
   
   res.status(statusCode).json({
      message: error.message,
   });
};
