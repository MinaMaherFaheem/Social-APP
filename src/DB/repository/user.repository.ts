import { CreateOptions, HydratedDocument, Model } from "mongoose";
import { DatabaseRepository } from "./database.repository";
import { IUser as TDocument } from "../../models/user.model";
import { BadRequestException } from "../../utils/response/error.reponse";

export class UserRepository extends DatabaseRepository<TDocument> {
  constructor(protected override readonly model: Model<TDocument>) {
    super(model);
  }

  

  async createUser({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions;
    }): Promise<HydratedDocument<TDocument>> {
    const [user] = (await this.create({ data })) || [];
    if (!user) {
      throw new BadRequestException("Fail to create this user");
    }
    return user;
  }

}