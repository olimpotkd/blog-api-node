import { Types } from "mongoose";

export default interface IComment {
  post: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
}
