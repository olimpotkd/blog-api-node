import { Schema, model } from "mongoose";
import { IComment } from "./interfaces";

const commentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    user: { type: Schema.Types.ObjectId, required: [true, "User is required"] },
    text: {
      type: String,
      required: [true, "Comment text is required"],
    },
  },
  { timestamps: true }
);

//Register Comment model into mongoose/mongo
const Comment = model<IComment>("Coment", commentSchema);

export default Comment;
