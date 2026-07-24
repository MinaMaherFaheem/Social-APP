import { DatabaseRepository, Lean } from "./database.repository";
import { IPost as TDocument } from "../../models/post.model";
import { HydratedDocument, Model, QueryOptions, RootFilterQuery } from "mongoose";
import { ProjectionType } from "mongoose";
export declare class PostRepository extends DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    private commentModel;
    constructor(model: Model<TDocument>);
    findCursor({ filter, select, options, }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | undefined;
        options?: QueryOptions<TDocument> | undefined;
    }): Promise<Lean<TDocument>[] | HydratedDocument<TDocument>[] | [] | any>;
}
//# sourceMappingURL=post.repository.d.ts.map