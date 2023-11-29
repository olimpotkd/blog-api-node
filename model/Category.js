const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
