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
import userController from "./modules/user/user.controller"


//Utils
import { BadRequestException, globalErrorHandlind } from './utils/response/error.reponse';


//DB
import connectDB from './DB/connection.database';

import { promisify } from 'node:util';
import { pipeline } from 'node:stream';
import { createGetPresignedLink, getFile } from './utils/multer/s3.config';

const createS3WriteStreamPipe = promisify(pipeline);



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
  app.use("/auth", authController);
  app.use("/user", userController);

  app.get("/upload/*path", async(req: Request, res: Response):Promise<void> => {
    const {downloadName ,download="false" } = req.query as {
      downloadName?: string;
      download?: string;
    }
    const { path } = req.params as unknown as { path: string[] };
    const Key = path.join("/");
    const s3Responce = await getFile({ Key });
    console.log(s3Responce.Body);
    if (!s3Responce?.Body) {
      throw new BadRequestException("fail to fetch this asset");
    }

    res.setHeader("Content-type", `${s3Responce.ContentType || "application/octet-stream"}`);

    if (download === "true") {
      res.setHeader("Content-Disposition",`attachment; filename="${downloadName || Key.split("/").pop()}"`)
    }

    return await createS3WriteStreamPipe(s3Responce.Body as NodeJS.ReadableStream, res)
  });

  app.get("/upload/pre-signed/*path", async (req: Request, res: Response): Promise<Response> => {
    const {downloadName ,download="false", expiresIn = 120 } = req.query as {
      downloadName?: string;
      download?: string;
      expiresIn?: number;
    }
    const { path } = req.params as unknown as { path: string[] };
    const Key = path.join("/");
    const url = await createGetPresignedLink({ Key, downloadName: downloadName as string ,download, expiresIn });

    return res.json({ message: "Done", data: { url } });
  });

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