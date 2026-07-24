import { DatabaseRepository, Lean } from "./database.repository";
import { IChat as TDocument } from "../../models/chat.model";
import { Model, RootFilterQuery } from "mongoose";
import { ProjectionType } from "mongoose";
import { QueryOptions } from "mongoose";
import { HydratedDocument } from "mongoose";

export class ChatRepository extends DatabaseRepository<TDocument> {
  constructor(protected override readonly model: Model<TDocument>) {
    super(model);
  }

  async findOneChat({
    filter,
    select,
    options,
    page=1,
    size=5
  }: {
    filter?: RootFilterQuery<TDocument>;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
    page?:number;
    size?:number;
  }): Promise<Lean<TDocument> | HydratedDocument<TDocument> | null> {
    
      page = Math.floor(page < 1 || !page ? 1 : page);
      size = Math.floor(size < 1 || !size ? 5 : size);

    const doc = this.model.findOne(filter, {
      message: { $slice: [-page * size, size] }
    })

    if (options?.lean) {
      doc.lean(options.lean);
    }

    return await doc.exec();
  }

}
