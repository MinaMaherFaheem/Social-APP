import type { NextFunction, Request, Response } from "express";
import { TokenEnum } from "../utils/security/token.security";
import { RoleEnum } from "../models/user.model";
export declare const authentication: (tokenType?: TokenEnum) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorization: (accessRoles?: RoleEnum[], tokenType?: TokenEnum) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authentication.middleware.d.ts.map