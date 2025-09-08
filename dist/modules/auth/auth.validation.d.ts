import { z } from "zod";
export declare const login: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
        confirmPassword: z.ZodString;
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
//# sourceMappingURL=auth.validation.d.ts.map