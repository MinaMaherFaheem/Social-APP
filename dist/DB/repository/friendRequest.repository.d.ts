import { DatabaseRepository } from "./database.repository";
import { IFriendRequest as TDocument } from "../../models/friendRequest.model";
import { Model } from "mongoose";
export declare class FriendRequestRepository extends DatabaseRepository<TDocument> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
//# sourceMappingURL=friendRequest.repository.d.ts.map