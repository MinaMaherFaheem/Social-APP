import {z}from "zod"
import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils/response/error.reponse";
import { ZodError, ZodType } from "zod";
import { Types } from "mongoose";
import { GraphQLError } from "graphql";


type KeyReqType = keyof Request; // 'body' | 'params' | 'query' | 'file'
type SchemaType = Partial<Record<KeyReqType, ZodType>>;

type ValidationErrorsType = Array<{
  key: KeyReqType;
  issues: Array<{
    message: string;
    path: string | number | symbol | undefined;
  }>;
}>;


export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction => {
    const validationErrors: ValidationErrorsType = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      if (!schema[key]) continue;
      if (req.file) {
        req.body.attachments = req.file;
      };
      if (req.files) {
        req.body.attachments = req.files;
      };

      const validationResult = schema[key].safeParse(req[key]);

      if (!validationResult.success) {
        const errors = validationResult.error as ZodError;

        validationErrors.push({
          key,
          issues: errors.issues.map((issue) => {
            return { 
              message: issue.message, 
              path: issue.path[0] 
            };
          })
        });

      }
    }

    if (validationErrors.length) {
      throw new BadRequestException("Validation Error", {
        validationErrors,
      });
    }
    return next() as unknown as NextFunction;
  };
};

export const graphValidation = async <T=any>(schema: ZodType, args:T) => {

  const validationResult = await schema.safeParseAsync(args);

  if (!validationResult.success) {
    const ZError = validationResult.error as ZodError;
    throw new GraphQLError("validation Error", {
      extensions: {
        statusCode: 400,
        issues: {
          key: "args",
          issues: ZError.issues.map((issue) => {
            return {
              path: issue.path,
              message: issue.message,
            }
          })
        }
      }
    })
  }

};

export const generalFields = {
  username: z
    .string({
      error: "username is required",
    })
    .min(2, { error: "min username length is 2 char" })
    .max(20, { error: "max username length is 20 char" }),
  email: z.email({
    error: "valid email must be like to example@domain.com",
  }),
  otp: z.string().regex(/^\d{6}$/),
  password: z
    .string()
    .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {}),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  file: function (mimetype: string[]) {
    return z
      .strictObject({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.enum(mimetype),
        buffer: z.any().optional(),
        path: z.string().optional(),
        size: z.number(),
      }).refine(data =>{
        return data.buffer || data.path
      },{
        error: "neither path or buffer is available",
        path: ["file"]
      })
    },
  id: z.string().refine((data) => {
    return Types.ObjectId.isValid(data);
  },{
    error: "invalid objectId format"
  })
}
