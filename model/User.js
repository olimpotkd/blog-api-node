const mongoose = require("mongoose");

//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is requires"],
    },
    profilePhoto: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Editor"],
    },
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    blocked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: [
      {
        type: String,
        enum: ["Free", "Premium", "Pro"],
        default: "Free",
      },
    ],
    userAward: {
      type: String,
      enum: ["Bronze", "Silver", "Gold"],
      default: "Bronze",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, //Allows for virtual defined properties to be shown on querying (See below)
  }
);

//Will add mongoose virtual property. This is a prop that only exists in the code/app, but is not really defined in MongoDB.
//Fullname
userSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
//Initials
userSchema.virtual("initials").get(function () {
  return `${this.firstName[0]}${this.lastName[0]}`;
});
//Post count
userSchema.virtual("postcount").get(function () {
  return this.posts.length;
});
//Followers count
userSchema.virtual("followerscount").get(function () {
  return this.followers.length;
});
//Following count
userSchema.virtual("followingcount").get(function () {
  return this.following.length;
});
//Viewer count
userSchema.virtual("viewerscount").get(function () {
  return this.viewers.length;
});
//Blocked count
userSchema.virtual("blockedcount").get(function () {
  return this.blocked.length;
});

//Register the user model into mongoose/mongo
const User = mongoose.model("User", userSchema);

module.exports = User;
