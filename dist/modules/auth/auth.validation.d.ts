import { z } from "zod";
export declare const login: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strict>;
};
export declare const signup: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        username: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
export declare const confirmEmail: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
    }, z.core.$strict>;
};
export declare const signupWithGmail: {
    body: z.ZodObject<{
        idToken: z.ZodString;
    }, z.core.$strict>;
};
export declare const sendForgotPasswordCode: {
    body: z.ZodObject<{
        email: z.ZodEmail;
    }, z.core.$strict>;
};
export declare const verifyForgotPassword: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
    }, z.core.$strict>;
};
export declare const resetForgotPassword: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
    }, z.core.$strict>;
};
//# sourceMappingURL=auth.validation.d.ts.map