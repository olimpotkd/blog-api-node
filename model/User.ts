import { ObjectId, Schema, model } from "mongoose";
import { IUser } from "./interfaces/";

//create schema
const userSchema = new Schema<IUser>(
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
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post", //This allows for the populate method to fill this prop with data from the Post collection
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    blocked: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    plan: {
      type: String,
      enum: ["Free", "Premium", "Pro"],
      default: "Free",
    },
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

//Mongoose hooks are middleware that will be executed depending on their purpose either before function
//execution (pre hook) or after function execution (post hook)
//This pre hook will run BEFORE any findById/findOne function gets executed
userSchema.pre("findOne", async function (next) {
  //Populate will fill the "posts" properties with the data from the Post collection.
  //This will be done by mongoose, when the ref has been specified in the schema
  //This could also be called from the controller, but here it makes more sense.
  //This is breaking, moved to profile controller
  // await this.populate("posts");

  // const userId = this._conditions._id;
  // const posts = await Post.find({ user: userId });
  // const lastPostDate = new Date(posts[posts.length - 1]?.createdAt);
  // const lastPostDateStr = lastPostDate.toDateString();
  // const currentDate = new Date();
  // const diffDays = (currentDate - lastPostDate) / (1000 * 3600 * 24);
  // // //------Last post date-------------
  // userSchema.virtual("lastPostDate").get(function () {
  //   return lastPostDateStr;
  // });
  // //------Block if inactive for 30 days -----
  // await User.findByIdAndUpdate(
  //   userId,
  //   {
  //     isBlocked: diffDays > 30,
  //   },
  //   {
  //     new: true,
  //   }
  // );
  // //-----Is Inactive---------
  // userSchema.virtual("isInactive").get(() => {
  //   return diffDays > 30; // If more than 30 days, is inactive
  // });
  //   // ----------Last Active---------
  //   userSchema.virtual("lastActive").get(() => {
  //     const lastActiveDays = Math.floor(diffDays);
  //     if (lastActiveDays <= 0) {
  //       return "Today";
  //     } else if (lastActiveDays === 1) {
  //       return "Yesterday";
  //     } else {
  //       return `${lastActiveDays} days ago`;
  //     }
  //   });
  //   // -------Update userAwards based on number of posts--------
  //   const numberOfPosts = posts.length;
  //   const award =
  //     numberOfPosts < 10 ? "Bronze" : numberOfPosts <= 20 ? "Silver" : "Gold";
  //   await User.findByIdAndUpdate(
  //     userId,
  //     {
  //       userAward: award,
  //     },
  //     { new: true }
  //   );
  next();
});

//Virtual properties.
//These are properties that only exists in the code/app, but is not really defined in MongoDB.
//
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
const User = model<IUser>("User", userSchema);

export default User;
