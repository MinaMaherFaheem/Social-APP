import { z } from "zod";
import { LogoutEnum } from "../../utils/security/token.security";
export declare const logout: {
    body: z.ZodObject<{
        flag: z.ZodDefault<z.ZodEnum<typeof LogoutEnum>>;
    }, z.core.$strict>;
};
//# sourceMappingURL=user.validation.d.ts.map