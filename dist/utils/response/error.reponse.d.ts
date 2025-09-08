import { NextFunction, Request, Response } from "express";
export interface IError extends Error {
    statusCode: number;
}
export declare class ApplicationException extends Error {
    statusCode: Number;
    constructor(message: string, statusCode: Number, cause?: unknown);
}
export declare class BadRequestException extends ApplicationException {
    constructor(message: string, cause?: unknown);
}
export declare class NotFoundException extends ApplicationException {
    constructor(message: string, cause?: unknown);
}
export declare const globalErrorHandlind: (error: IError, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=error.reponse.d.ts.map