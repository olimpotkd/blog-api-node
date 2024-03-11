import { Types } from "mongoose";

export default interface ICategory {
  user: Types.ObjectId;
  title: string;
}
