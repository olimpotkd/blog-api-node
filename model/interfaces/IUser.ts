import { Types } from "mongoose";

export default interface IUser {
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  email: string;
  password: string;
  isBlocked: boolean;
  isAdmin: boolean;
  role: string;
  viewers: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  posts: Types.ObjectId[];
  comments: Types.ObjectId[];
  blocked: Types.ObjectId[];
  plan: string;
  userAward: string;
}
