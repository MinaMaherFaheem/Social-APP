import type { Request, Response } from "express";
declare class AuthenticationService {
    private userModel;
    constructor();
    private verifyGmailAccount;
    signupWithGmail: (req: Request, res: Response) => Promise<Response>;
    loginWithGmail: (req: Request, res: Response) => Promise<Response>;
    signup: (req: Request, res: Response) => Promise<Response>;
    confirmEmail: (req: Request, res: Response) => Promise<Response>;
    login: (req: Request, res: Response) => Promise<Response>;
    sendForgotCode: (req: Request, res: Response) => Promise<Response>;
    verifyForgotPassword: (req: Request, res: Response) => Promise<Response>;
    resetForgotPassword: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: AuthenticationService;
export default _default;
//# sourceMappingURL=auth.service.d.ts.map