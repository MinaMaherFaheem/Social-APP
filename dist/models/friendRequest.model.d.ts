import { HydratedDocument, Types } from "mongoose";
export interface IFriendRequest {
    createdBy: Types.ObjectId;
    sendTo: Types.ObjectId;
    acceptedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const FriendRequestModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IFriendRequest, {}, {}, {}, import("mongoose").Document<unknown, {}, IFriendRequest, {}, {}> & IFriendRequest & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export type HFriendRequestDocument = HydratedDocument<IFriendRequest>;
//# sourceMappingURL=friendRequest.model.d.ts.map