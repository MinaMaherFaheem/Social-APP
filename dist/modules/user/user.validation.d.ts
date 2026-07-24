import { z } from "zod";
import { LogoutEnum } from "../../utils/security/token.security";
import { RoleEnum } from "../../models";
export declare const sendFriendRequest: {
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strict>;
};
export declare const acceptFriendRequest: {
    params: z.ZodObject<{
        requestId: z.ZodString;
    }, z.core.$strict>;
};
export declare const changeRole: {
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strict>;
    body: z.ZodObject<{
        flag: z.ZodEnum<typeof RoleEnum>;
    }, z.core.$strict>;
};
export declare const logout: {
    body: z.ZodObject<{
        flag: z.ZodDefault<z.ZodEnum<typeof LogoutEnum>>;
    }, z.core.$strict>;
};
export declare const freezeAccount: {
    params: z.ZodOptional<z.ZodObject<{
        userId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
};
export declare const restoreAccount: {
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strip>;
};
export declare const hardDelete: {
    params: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=user.validation.d.ts.map