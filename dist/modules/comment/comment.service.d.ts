import type { Request, Response } from "express";
declare class CommentService {
    private userModel;
    private postModel;
    private commentModel;
    constructor();
    createComment: (req: Request, res: Response) => Promise<Response>;
    replyOnComment: (req: Request, res: Response) => Promise<Response>;
}
declare const _default: CommentService;
export default _default;
//# sourceMappingURL=comment.service.d.ts.map