import { HydratedDocument, Types } from "mongoose";
import { IPost } from "./post.model";
export interface IComment {
    createdBy: Types.ObjectId;
    postId: Types.ObjectId | Partial<IPost>;
    commentId?: Types.ObjectId;
    content?: string;
    attachments?: string[];
    likes?: Types.ObjectId[];
    tags?: Types.ObjectId[];
    freezedAt?: Date;
    freezedBy?: Types.ObjectId;
    restoredAt?: Date;
    restoredBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const CommentModel: import("mongoose").Model<any, {}, {}, {}, any, any> | import("mongoose").Model<IComment, {}, {}, {}, import("mongoose").Document<unknown, {}, IComment, {}, {}> & IComment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>;
export type HCommentDocument = HydratedDocument<IComment>;
//# sourceMappingURL=comment.model.d.ts.map