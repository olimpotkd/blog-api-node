const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is required"],
    },
    user: { type: Object, required: [true, "User is required"] },
    text: {
      type: String,
      required: [true, "Comment text is required"],
    },
  },
  { timestamps: true }
);

//Register Comment model into mongoose/mongo
const Comment = mongoose.model("Coment", commentSchema);

module.exports = Comment;
