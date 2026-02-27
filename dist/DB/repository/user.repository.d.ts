import { CreateOptions, HydratedDocument, Model } from "mongoose";
import { DatabaseRepository } from "./database.repository";
import { IUser as TDocument } from "../../models/user.model";
export declare class UserRepository extends DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
    createUser({ data, options, }: {
        data: Partial<TDocument>[];
        options?: CreateOptions;
    }): Promise<HydratedDocument<TDocument>>;
}
//# sourceMappingURL=user.repository.d.ts.map