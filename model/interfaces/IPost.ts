import { Types } from "mongoose";

export default interface IPost {
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
