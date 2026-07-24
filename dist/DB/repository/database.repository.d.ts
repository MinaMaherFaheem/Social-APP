import { DeleteResult, Types } from "mongoose";
import { ProjectionType, RootFilterQuery, CreateOptions, HydratedDocument, Model, QueryOptions, FlattenMaps, UpdateQuery, MongooseUpdateQueryOptions, UpdateWriteOpResult } from "mongoose";
export type Lean<T> = HydratedDocument<FlattenMaps<T>>;
export declare abstract class DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    find({ filter, select, options, }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | undefined;
        options?: QueryOptions<TDocument> | undefined;
    }): Promise<Lean<TDocument>[] | HydratedDocument<TDocument>[] | []>;
    paginate({ filter, select, options, page, size }: {
        filter: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | undefined;
        options?: QueryOptions<TDocument> | undefined;
        page?: number | "all";
        size?: number;
    }): Promise<Lean<TDocument>[] | HydratedDocument<TDocument>[] | [] | any>;
    findOne({ filter, select, options, }: {
        filter?: RootFilterQuery<TDocument>;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<Lean<TDocument> | HydratedDocument<TDocument> | null>;
    findById({ id, select, options, }: {
        id: Types.ObjectId;
        select?: ProjectionType<TDocument> | null;
        options?: QueryOptions<TDocument> | null;
    }): Promise<Lean<TDocument> | HydratedDocument<TDocument> | null>;
    create({ data, options, }: {
        data: Partial<TDocument>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<TDocument>[]>;
    insertMany({ data }: {
        data: Partial<TDocument>[];
    }): Promise<HydratedDocument<TDocument>[]>;
    updateOne({ filter, update, options, }: {
        filter: RootFilterQuery<TDocument>;
        update: UpdateQuery<TDocument>;
        options?: MongooseUpdateQueryOptions<TDocument> | null;
    }): Promise<UpdateWriteOpResult>;
    findByIdAndUpdate({ id, update, options, }: {
        id: Types.ObjectId;
        update?: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | Lean<TDocument> | null>;
    findOneAndUpdate({ filter, update, options, }: {
        filter?: RootFilterQuery<TDocument>;
        update?: UpdateQuery<TDocument>;
        options?: QueryOptions<TDocument> | null;
    }): Promise<HydratedDocument<TDocument> | Lean<TDocument> | null>;
    deleteOne({ filter, }: {
        filter: RootFilterQuery<TDocument>;
    }): Promise<DeleteResult>;
}
//# sourceMappingURL=database.repository.d.ts.map