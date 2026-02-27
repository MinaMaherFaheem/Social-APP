import { HUserDocument } from "../../models/user.model";

export interface IProfileImageResponse {
  url: string;
}

export interface IUserResponse {
  user: Partial<HUserDocument>
}