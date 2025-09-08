import z from "zod";
import * as validators from "./auth.validation";
export type ISignupBodyInputDTO = z.infer<typeof validators.signup.body>;
//# sourceMappingURL=auth.dto.d.ts.map