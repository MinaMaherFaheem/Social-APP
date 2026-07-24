import { DatabaseRepository } from "./database.repository";
import { IComment as TDocument } from "../../models/comment.model";
import { Model } from "mongoose";
export declare class CommentRepository extends DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=comment.repository.d.ts.map