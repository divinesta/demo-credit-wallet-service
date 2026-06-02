import { Request, Response } from "express";

import { registerUser } from "../services/user.service";


export const createUserAccount = async (req: Request, res: Response) => {
   const user = await registerUser(req.body);

   res.status(201).json({
      status: "User account created successfully",
      data: user,
   });
}