import { DeleteResult, Types } from "mongoose";
import { ProjectionType, RootFilterQuery, CreateOptions, HydratedDocument, Model, QueryOptions, FlattenMaps, UpdateQuery, MongooseUpdateQueryOptions, UpdateWriteOpResult } from "mongoose";

export type Lean<T> = HydratedDocument<FlattenMaps<T>>




export abstract class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async findOne({
    filter,
    select,
    options,
  }: {
    filter?: RootFilterQuery<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }): Promise<Lean<TDocument> | HydratedDocument<TDocument> | null> {
    const doc = this.model.findOne(filter).select(select || "");

    if (options?.lean) {
      doc.lean(options.lean);
    }

    return await doc.exec();
  }

  async create({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions;
  }): Promise<HydratedDocument<TDocument>[]> {
    return await this.model.create(data, options);
  }

  async updateOne({
    filter,
    update,
    options,
  }: {
    filter: RootFilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
    }
  ): Promise<UpdateWriteOpResult> {
  return await this.model.updateOne(
      filter,
      {
        ...update,
        $inc: { __v: 1 },
      },
      options
    );
  }

  async findByIdAndUpdate({
    id,
    update,
    options,
  }: {
    id: Types.ObjectId;
    update?: UpdateQuery<TDocument>;
    options?: QueryOptions<TDocument> | null
    }
  ): Promise<HydratedDocument<TDocument> | Lean<TDocument> | null> {
  return this.model.findByIdAndUpdate(
      id,
      {
        ...update,
        $inc: { __v: 1 },
      },
      options
    );
  }

  async deleteOne({
    filter,
  }: {
    filter: RootFilterQuery<TDocument>;
    }
  ): Promise<DeleteResult> {
    return await this.model.deleteOne(filter);
  }

}
