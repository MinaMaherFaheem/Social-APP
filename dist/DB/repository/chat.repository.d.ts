import { DatabaseRepository, Lean } from "./database.repository";
import { IChat as TDocument } from "../../models/chat.model";
import { Model, RootFilterQuery } from "mongoose";
import { ProjectionType } from "mongoose";
import { QueryOptions } from "mongoose";
import { HydratedDocument } from "mongoose";
export declare class ChatRepository extends DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOneChat({ filter, select, options, page, size }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
        page?: number;
        size?: number;
    }): Promise<Lean<TDocument> | HydratedDocument<TDocument> | null>;
}
//# sourceMappingURL=chat.repository.d.ts.map