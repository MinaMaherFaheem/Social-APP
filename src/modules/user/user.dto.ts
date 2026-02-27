import {z} from "zod";
import { freezeAccount, hardDelete, logout, restoreAccount } from "./user.validation";


export type ILogoutDto = z.infer<typeof logout.body>
export type IFreezeAccountDTO = z.infer<typeof freezeAccount.params>
export type IRestoreAccountDTO = z.infer<typeof restoreAccount.params>
export type IHardDeleteDTO = z.infer<typeof hardDelete.params>
