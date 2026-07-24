import type { Request, Response } from "express";
import { AvailabilityEnum } from "../../models/post.model";
import { Types } from "mongoose";
export declare const postAvailability: (req: Request) => ({
    availability: AvailabilityEnum;
    createdBy?: never;
    tags?: never;
} | {
    availability: AvailabilityEnum;
    createdBy: Types.ObjectId | undefined;
    tags?: never;
} | {
    availability: AvailabilityEnum;
    createdBy: {
        $in: (Types.ObjectId | undefined)[];
    };
    tags?: never;
} | {
    availability: {
        $ne: AvailabilityEnum;
    };
    tags: {
        $in: Types.ObjectId | undefined;
    };
    createdBy?: never;
})[];
declare class PostService {
    private userModel;
    private postModel;
    constructor();
    createPost: (req: Request, res: Response) => Promise<Response>;
    updatePost: (req: Request, res: Response) => Promise<Response>;
    likePost: (req: Request, res: Response) => Promise<Response>;
    postList: (req: Request, res: Response) => Promise<Response>;
}
export declare const postService: PostService;
export {};
//# sourceMappingURL=post.service.d.ts.map