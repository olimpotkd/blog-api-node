import { Schema, model } from "mongoose";
import { ICategory } from "./interfaces";

const categorySchema = new Schema<ICategory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//Register Category model into mongoose/mongo
const Category = model<ICategory>("Category", categorySchema);

export default Category;
