import { Schema, model, HydratedDocument, Types, models } from "mongoose"



export interface IMessage {
  createdBy: Types.ObjectId;
  content: string;

  createdAt?: Date;
  updatedAt?: Date;
}
export type HMessageDocument = HydratedDocument<IMessage>;

export interface IChat {
  participants: Types.ObjectId[];
  message?: IMessage[];
  group?: string;
  group_image?: string;
  roomId?: string;

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;

}
export type HChatDocument = HydratedDocument<IChat>;

const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true},
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true},
  },
  {
    timestamps: true,
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

const chatSchema = new Schema<IChat>(
  {
    participants: [{type: Schema.Types.ObjectId, ref: "User", required: true}],
    message: [messageSchema],
    createdBy: {type: Schema.Types.ObjectId, ref: "User", required: true},

    group: { type: String },
    group_image: { type: String },
    roomId: { type: String, required: function(){
      return this.group
    } },

  },
  {
    timestamps: true,
    strictQuery: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);


chatSchema.pre(["find","findOne","countDocuments"], function (next) {
  const query = this.getQuery();
  if (query.paranoid === false) {
    this.setQuery({...query});
  } else {
    this.setQuery({...query, freezedAt: {$exists: false}});
  }
  next();
});

chatSchema.pre(["updateOne","findOneAndUpdate"], function (next) {
  const query = this.getQuery();
  if (query.paranoid === false) {
    this.setQuery({...query});
  } else {
    this.setQuery({...query, freezedAt: {$exists: false}});
  }
  next();
});

chatSchema.virtual("reply",{
  localField: "_id",
  foreignField: "ChatId",
  ref: "Chat",
  justOne: true
})



export const ChatModel = models.Chat || model<IChat>("Chat", chatSchema);
