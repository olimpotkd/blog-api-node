import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import Post from "../model/Post";
import Comment from "../model/Comment";
import Category from "../model/Category";

import bcrypt from "bcryptjs";
import { generateToken } from "../util/jwtUtility";

import AWSFileUpload from "../util/AWSUtility";
import errorHandler from "../util/errorHandler";
import AWSDirectories from "../util/constants";
import { Types } from "mongoose";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password, isAdmin } = req.body;

  try {
    //Check if email exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      return next(errorHandler("User already exists", 500));
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin: isAdmin,
    });

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    //Check if email exists, and check for valid password
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler("Wrong email or password"));
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!(user && passwordMatched)) {
      return next(errorHandler("Wrong email or password"));
    }

    res.json({
      status: "success",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      },
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //Moved populate here from User model
    const user = await User.findById(req.authUserId).populate({
      path: "posts",
    });

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

//who viewed
const getProfileViewers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //1. Find the user who posted the blog entry (:id)
    const user = await User.findById(req.params.id);

    //2. Find the user who viewd the original user (the current user)
    const currentUser = await User.findById(req.authUserId);

    //3. Check if user and currentUser are found
    if (user && currentUser) {
      //4. Check if currentUser already viewed the user's profile.
      const isUserAlreadyViewed = user.viewers.includes(currentUser._id);

      if (isUserAlreadyViewed) {
        return next(errorHandler("You already viewed this profile"));
      } else {
        user.viewers.push(currentUser.id);
        await user.save();
        res.json({
          status: "success",
          data: "You have viewd the profile",
        });
      }
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const follow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //1. Find user to follow
    const userToFollow = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    if (!currentUser || !userToFollow) {
      return next(errorHandler("Invalid users", 400));
    }

    //3. Check both
    if (currentUser && userToFollow) {
      //4. Check if user is already following
      const isAlreadyFollowing = userToFollow.followers.includes(
        currentUser._id
      );

      //5. If not already following, add
      if (isAlreadyFollowing) {
        return next(errorHandler("You already follow this user"));
      } else {
        userToFollow.followers.push(currentUser._id);
        currentUser.following.push(userToFollow._id);

        await currentUser.save();
        await userToFollow.save();

        res.json({
          status: "success",
          data: "Now following",
        });
      }
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const unfollow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //1. Find user to unfollow
    const userToUnfollow = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (currentUser && userToUnfollow) {
      //4. Check if user is already following
      const isAlreadyFollowing = userToUnfollow.followers.includes(
        currentUser._id
      );

      //5. If already following, remove
      if (isAlreadyFollowing) {
        userToUnfollow.followers = userToUnfollow.followers.filter(
          (follower) => follower !== <Types.ObjectId>currentUser._id
        );
        currentUser.following = currentUser.following.filter(
          (following) => following !== userToUnfollow._id
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.json({
          status: "success",
          data: "You unfollowed this user",
        });
      } else {
        return next(errorHandler("You don't follow this user"));
      }
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //1. Find user to block
    const userToBlock = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (currentUser && userToBlock) {
      //4. Check if user is already blocked
      const isAlreadyBlocked = currentUser.blocked.includes(userToBlock._id);

      //5. If not already blocked, block
      if (isAlreadyBlocked) {
        return next(errorHandler("User is already blocked"));
      } else {
        currentUser.blocked.push(userToBlock.id);

        await currentUser.save();

        res.json({
          status: "success",
          data: "User is now blocked",
        });
      }
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //1. Find user to block
    const userToUnblock = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (currentUser && userToUnblock) {
      //4. Check if user is already blocked
      const isAlreadyBlocked = currentUser.blocked.includes(userToUnblock._id);

      //5. If already blocked, unblock
      if (isAlreadyBlocked) {
        currentUser.blocked = currentUser.blocked.filter(
          (blockedUser) => blockedUser !== userToUnblock.id
        );

        await currentUser.save();

        res.json({
          status: "success",
          data: "User is now unblocked",
        });
      } else {
        return next(errorHandler("User is not blocked"));
      }
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const adminBlockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //1. Find user to block
    const userToBlock = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (!userToBlock) {
      return next(errorHandler("User not found"));
    }

    if (currentUser && userToBlock) {
      //4. Check if not already blocked, block
      if (userToBlock.isBlocked) {
        return next(errorHandler("User is already blocked"));
      } else {
        userToBlock.isBlocked = true;

        await userToBlock.save();

        res.json({
          status: "success",
          data: "User is now blocked",
        });
      }
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const adminUnblockUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //1. Find user to block
    const userToUnblock = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (!userToUnblock) {
      return next(errorHandler("User not found"));
    }

    if (currentUser && userToUnblock) {
      //4. Unblock
      userToUnblock.isBlocked = false;
      await userToUnblock.save();
      res.json({
        status: "success",
        data: "User is now unblocked",
      });
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, lastName, firstName } = req.body;
  try {
    // Check if new email is already used
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(errorHandler("Email is taken", 400));
      }
    }

    //Update user
    const user = await User.findByIdAndUpdate(
      req.authUserId,
      {
        lastName,
        firstName,
        email,
      },
      { new: true, runValidators: true }
    );
    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body;

  try {
    //Check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //update user
      await User.findByIdAndUpdate(
        req.authUserId,
        { password: hashedPassword },
        { new: true, runValidators: true }
      );
    } else {
      return next(errorHandler("Password cannot be empty"));
    }
    res.json({
      status: "success",
      data: "Password updated",
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

//Profile Photo Upload
const profilePhotoUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //1. Find user
    const userToUpdate = await User.findById(req.authUserId);

    //2. Check if user is found
    if (!userToUpdate) {
      return next(errorHandler("User not found", 403));
    }

    //3. Check if user is blocked
    if (userToUpdate.isBlocked) {
      return next(errorHandler("Action not allowed, account is blocked", 403));
    }

    //4. Check if user is updating photo
    if (req.file) {
      //5. Update profile photo
      //Upload to AWS
      const uploadResponse: AWS.S3.ManagedUpload.SendData | AWS.S3.Error =
        await AWSFileUpload(
          req.file,
          userToUpdate.id.toString(),
          AWSDirectories.profilePhotos
        );

      if (isSendData(uploadResponse)) {
        //Update DB with picture location
        await User.findByIdAndUpdate(
          req.authUserId,
          {
            $set: {
              profilePhoto: uploadResponse.Location,
            },
          },
          { new: true }
        );

        res.json({
          status: "sucess",
          data: "Profile photo uploaded",
        });
      } else {
        errorHandler(`Upload failed: ${uploadResponse.Message}`, 500);
      }
    } else {
      errorHandler(`Upload failed: Missing file`, 500);
    }
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Post.deleteMany({ user: req.authUserId });
    await Comment.deleteMany({ user: req.authUserId });
    await Category.deleteMany({ user: req.authUserId });
    await User.findByIdAndDelete(req.authUserId);

    res.json({
      status: "success",
      data: "User account deleted",
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const isSendData = (
  response: AWS.S3.ManagedUpload.SendData | AWS.S3.Error
): response is AWS.S3.ManagedUpload.SendData => {
  return (response as AWS.S3.ManagedUpload.SendData).Location !== undefined;
};

export {
  adminBlockUser,
  adminUnblockUser,
  blockUser,
  deleteUser,
  follow,
  getAllUsers,
  getProfileViewers,
  getUserProfile,
  login,
  profilePhotoUpload,
  registerUser,
  unblockUser,
  unfollow,
  updateUser,
  updatePassword,
};
