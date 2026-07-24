import { HChatDocument } from "../../models";
import { HUserDocument } from "../../models/user.model";

export interface IProfileImageResponse {
  url: string;
}

export interface IUserProfileResponse {
  user: Partial<HUserDocument>;
  groups?: Partial<HChatDocument>[];
}
