import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
type KeyReqType = keyof Request;
type SchemaType = Partial<Record<KeyReqType, ZodType>>;
export declare const validation: (schema: SchemaType) => (req: Request, res: Response, next: NextFunction) => NextFunction;
export declare const generalFields: {
    username: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    confirmPassword: z.ZodString;
};
export {};
//# sourceMappingURL=validation.middleware.d.ts.map