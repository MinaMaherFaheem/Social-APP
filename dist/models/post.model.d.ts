import { HydratedDocument, Types } from "mongoose";
export declare enum AllowCommentsEnum {
    allow = "allow",
    deny = "deny"
}
export declare enum AvailabilityEnum {
    public = "public",
    friends = "friends",
    onlyMe = "only-me"
}
export declare enum LikeActionEnum {
    like = "like",
    unlike = "unlike"
}
export interface IPost {
    content?: string;
    attachments?: string[];
    assetsFolderId: string;
    availability: AvailabilityEnum;
    allowComments: AllowCommentsEnum;
    likes?: Types.ObjectId[];
    tags?: Types.ObjectId[];
    createdBy: Types.ObjectId;
    freezedAt?: Date;
    freezedBy?: Types.ObjectId;
    restoredAt?: Date;
    restoredBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const PostModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IPost, {}, {}, {}, import("mongoose").Document<unknown, {}, IPost, {}, {}> & IPost & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export type HPostDocument = HydratedDocument<IPost>;
//# sourceMappingURL=post.model.d.ts.map