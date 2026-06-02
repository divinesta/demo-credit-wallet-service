import express from "express";

import { healthRouter } from "./routes/health.route";
import { userRouter } from "./routes/user.route";

import { errorMiddleware } from "./middlewares/error.middleware";

export const createApp = () => {
   const app = express();

   app.use(express.json());

   app.use("/health", healthRouter);
   app.use("/users", userRouter);

   app.use(errorMiddleware);

   return app;
};