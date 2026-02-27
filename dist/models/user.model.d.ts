import { Types, HydratedDocument } from "mongoose";
export declare enum GenderEnum {
    male = "male",
    female = "female"
}
export declare enum RoleEnum {
    user = "user",
    admin = "admin"
}
export declare enum ProviderEnum {
    GOOGLE = "GOOGLE",
    SYSTEM = "SYSTEM"
}
export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    username?: string;
    email: string;
    confirmEmailOtp?: string;
    confirmedAt?: Date;
    password: string;
    resetPasswordOtp?: string;
    changeCredentialsTime?: Date;
    phone?: string;
    address?: string;
    profileImage?: string;
    coverImages?: string[];
    gender: GenderEnum;
    role: RoleEnum;
    provider: ProviderEnum;
    createdAt: Date;
    updatedAt?: Date;
}
export declare const UserModel: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export type HUserDocument = HydratedDocument<IUser>;
//# sourceMappingURL=user.model.d.ts.map