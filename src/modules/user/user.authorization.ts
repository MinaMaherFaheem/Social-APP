import { RoleEnum } from "../../models/user.model";

export const endpoint = {
  profile: [RoleEnum.user],
  restoreAccount: [RoleEnum.admin],
  hardDelete: [RoleEnum.admin],
};