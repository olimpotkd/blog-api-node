const User = require("../model/User");
const Post = require("../model/Post");
const Comment = require("../model/Comment");
const Category = require("../model/Category");

const bcrypt = require("bcryptjs");
const { generateToken } = require("../util/jwtUtility");

const AWSFileUpload = require("../util/AWSUtility");
const errorHandler = require("../util/errorHandler");
const AWSDirectories = require("../util/constants");

const registerUser = async (req, res, next) => {
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
    next(errorHandler(error.message));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //Check if email exists, and check for valid password
    const user = await User.findOne({ email });
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
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const getUserProfile = async (req, res, next) => {
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
    next(errorHandler(error.message));
  }
};

const getAllUsers = async (_, res, next) => {
  try {
    const users = await User.find();
    res.json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

//who viewed
const getProfileViewers = async (req, res, next) => {
  try {
    //1. Find the user who posted the blog entry (:id)
    const user = await User.findById(req.params.id);

    //2. Find the user who viewd the original user (the current user)
    const currentUser = await User.findById(req.authUserId);

    //3. Check if user and currentUser are found
    if (user && currentUser) {
      //4. Check if currentUser already viewed the user's profile.
      const isUserAlreadyViewed = user.viewers.some((viewer) => {
        const viewerId = viewer.toString();
        const currentUserId = currentUser.id.toString();
        return currentUserId === viewerId;
      });

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
    next(errorHandler(error.message));
  }
};

const follow = async (req, res, next) => {
  try {
    //1. Find user to follow
    const userToFollow = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (currentUser && userToFollow) {
      //4. Check if user is already following
      const isAlreadyFollowing = userToFollow.followers.some(
        (follower) => follower.toString() === currentUser.id.toString()
      );

      //5. If not already following, add
      if (isAlreadyFollowing) {
        return next(errorHandler("You already follow this user"));
      } else {
        userToFollow.followers.push(currentUser.id);
        currentUser.following.push(userToFollow.id);

        await currentUser.save();
        await userToFollow.save();

        res.json({
          status: "success",
          data: "Now following",
        });
      }
    }
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const unfollow = async (req, res, next) => {
  try {
    //1. Find user to unfollow
    const userToUnfollow = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (currentUser && userToUnfollow) {
      //4. Check if user is already following
      const isAlreadyFollowing = userToUnfollow.followers.some(
        (follower) => follower.toString() === currentUser.id.toString()
      );

      //5. If already following, remove
      if (isAlreadyFollowing) {
        userToUnfollow.followers.pop(currentUser.id);
        currentUser.following.pop(userToUnfollow.id);

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
    next(errorHandler(error.message));
  }
};

const blockUser = async (req, res, next) => {
  try {
    //1. Find user to block
    const userToBlock = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (currentUser && userToBlock) {
      //4. Check if user is already blocked
      const isAlreadyBlocked = currentUser.blocked.some(
        (blockedUserId) =>
          blockedUserId.toString() === userToBlock.id.toString()
      );

      //5. If not already blocked, block
      if (isAlreadyBlocked) {
        return next(errorHandler("User is already blocked"));
      } else {
        currentUser.blocked.push(userToBlock);

        await currentUser.save();

        res.json({
          status: "success",
          data: "User is now blocked",
        });
      }
    }
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const unblockUser = async (req, res, next) => {
  try {
    //1. Find user to block
    const userToUnblock = await User.findById(req.params.id);

    //2. Get current user
    const currentUser = await User.findById(req.authUserId);

    //3. Check both
    if (currentUser && userToUnblock) {
      //4. Check if user is already blocked
      const isAlreadyBlocked = currentUser.blocked.some(
        (blockedUserId) =>
          blockedUserId.toString() === userToUnblock.id.toString()
      );

      //5. If already blocked, unblock
      if (isAlreadyBlocked) {
        currentUser.blocked.pop(userToUnblock);

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
    next(errorHandler(error.message));
  }
};

const adminBlockUser = async (req, res, next) => {
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
    next(errorHandler(error.message));
  }
};

const adminUnblockUser = async (req, res, next) => {
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
    next(errorHandler(error.message));
  }
};

const updateUser = async (req, res, next) => {
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
    next(errorHandler(error.message));
  }
};

const updatePassword = async (req, res, next) => {
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
    next(errorHandler(error.message));
  }
};

//Profile Photo Upload
const profilePhotoUpload = async (req, res, next) => {
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
      const uploadResponse = await AWSFileUpload(
        req.file,
        userToUpdate.id.toString(),
        AWSDirectories.profilePhotos
      );

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
      errorHandler(`Upload failed: ${uploadResponse.message}`, 500);
    }
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const deleteUser = async (req, res, next) => {
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
    next(errorHandler(error.message));
  }
};

module.exports = {
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
