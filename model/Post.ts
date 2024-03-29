import { Schema, model } from "mongoose";
import { IPost } from "./interfaces";

//create schema
const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Post Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Post Description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Post category is required"],
    },
    viewers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    photo: {
      type: String,
      // required: [true, "Post image is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, //Allows for virtual defined properties to be shown on querying (See below)
  }
);

postSchema.pre("findOne", async function (next) {});

//Viewers count
postSchema.virtual("viewersCount").get(function () {
  return this.viewers.length;
});
//Likes count
postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});
//Dislikes count
postSchema.virtual("dislikesCount").get(function () {
  return this.dislikes.length;
});
//Likes percentage
postSchema.virtual("likesPercentage").get(function () {
  const post = this;
  const sum: number = post.likes.length + post.dislikes.length;
  return (post.likes.length / sum) * 100;
});
//Dislikes percentage
postSchema.virtual("dislikesPercentage").get(function () {
  const post = this;
  const sum: number = post.likes.length + post.dislikes.length;
  return (post.dislikes.length / sum) * 100;
});

//Days ago
postSchema.virtual("daysAgo").get(function () {
  const post = this;
  const date = new Date(<string>post.createdAt);
  const daysAgo = Math.floor((Date.now() - date.getTime()) / 86400000);
  return daysAgo === 0
    ? "Today"
    : daysAgo === 1
    ? "Yesterday"
    : `${daysAgo} days ago`;
});

//Register the post model into mongoose/mongo
const Post = model<IPost>("Post", postSchema);

export default Post;
