import { ProjectionType, RootFilterQuery, CreateOptions, HydratedDocument, Model, QueryOptions, FlattenMaps, UpdateQuery, MongooseUpdateQueryOptions, UpdateWriteOpResult } from "mongoose";
export type Lean<T> = HydratedDocument<FlattenMaps<T>>;
export declare abstract class DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    findOne({ filter, select, options, }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<Lean<TDocument> | HydratedDocument<TDocument> | null>;
    create({ data, options, }: {
        data: Partial<TDocument>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<TDocument>[]>;
    updateOne({ filter, update, options, }: {
        filter: RootFilterQuery<TDocument>;
        update: UpdateQuery<TDocument>;
        options?: MongooseUpdateQueryOptions<TDocument> | null;
    }): Promise<UpdateWriteOpResult>;
}
//# sourceMappingURL=database.repository.d.ts.map