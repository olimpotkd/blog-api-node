import { Types, SchemaTimestampsConfig } from "mongoose";

export default interface IPost extends Document, SchemaTimestampsConfig {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: Types.ObjectId;
  viewers: Types.ObjectId[];
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  comments: Types.ObjectId[];
  user: Types.ObjectId;
  photo?: string;
}
