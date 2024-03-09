import mongoose, { Mongoose } from "mongoose";

//create schema
const postSchema = new mongoose.Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Post category is required"],
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
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

//TODO CARLOS
//Days ago
// postSchema.virtual("daysAgo").get(function () {
//   const post = this;
//   const date = new Date(post.createdAt);
//   const daysAgo = Math.floor((Date.now() - date) / 86400000);
//   return daysAgo === 0
//     ? "Today"
//     : daysAgo === 1
//     ? "Yesterday"
//     : `${daysAgo} days ago`;
// });

//Register the post model into mongoose/mongo
const Post = mongoose.model("Post", postSchema);

export default Post;
