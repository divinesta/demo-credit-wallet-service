import { NextFunction, Request, Response } from "express";

type AsyncController<T extends Request = Request> = (req: T, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = <T extends Request = Request>(controller: AsyncController<T>) => {
   return (req: Request, res: Response, next: NextFunction) => {
      controller(req as T, res, next).catch(next);
   };
};
