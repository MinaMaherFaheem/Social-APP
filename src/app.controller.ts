//Setup Env
import { resolve } from 'node:path';
import { config } from 'dotenv';
config({ path: resolve("./config/.env.development") });

//Load express and express types
import type { Express, Request, Response } from "express";
import express from "express";

//Third party middleware
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

//Modules routing
import authController from "./modules/auth/auth.controller"


//Utils
import { globalErrorHandlind } from './utils/response/error.reponse';


//DB
import connectDB from './DB/connection.database';



const limiter =rateLimit({
  windowMs: 60 * 60000,
  limit: 2000,
  message: {error: "to many request please try again later"},
  statusCode: 429
});



// app-start-point
const bootstarp = async (): Promise<void> => {

  const port: number | string = process.env.PORT || 5000;
  const app: Express = express();

  //Global application middleware
  app.use(cors());
  app.use(express.json());
  app.use(helmet());
  app.use(limiter);

  //app-routing
  app.get("/", (req:Request, res:Response) => {
    res.json({message: `welcome to ${process.env.APPLICATION_NAME} backend landing page 💖🍀`})
  })

  //sub-app-routing-modules
  app.use("/auth", authController)

  //In-valid routing
  app.use("{/*dummy}", (req: Request, res: Response) => {
    return res.status(404).json({ message: "In-valid application routing please check the method and url ❌" })
  })

  //Global-error-handling
  app.use(globalErrorHandlind)

  //DB
  await connectDB()

  //start server
  app.listen(port, () => {
    console.log(`Server is running on port :::${port}`);
  })
}

export default bootstarp