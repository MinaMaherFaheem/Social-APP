import { Types } from "mongoose";
export declare enum GenderEnum {
    male = "male",
    female = "female"
}
export declare enum RoleEnum {
    user = "user",
    admin = "admin"
}
export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    userName?: string;
    email: string;
    confirmEmailOtp?: string;
    confirmedAt?: Date;
    password: string;
    resetPasswordOtp?: string;
    changeCredentialsTime: string;
}
declare const userModel: import("mongoose").Model<IUser, {}, {}, {}, import("mongoose").Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=user.model.d.ts.map