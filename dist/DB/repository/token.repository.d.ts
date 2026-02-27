import { DatabaseRepository } from "./database.repository";
import { IToken as TDocument } from "../../models/token.model";
import { Model } from "mongoose";
export declare class TokenRepository extends DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=token.repository.d.ts.map