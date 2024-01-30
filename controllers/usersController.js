const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { generateToken, getTokenFromHeader } = require("../util/jwtUtility");

const AWSProfilePicUpload = require("../util/AWSUtility");
const errorHandler = require("../util/errorHandler");

const registerUser = async (req, res, next) => {
  const { firstName, lastName, profilePhoto, email, password } = req.body;

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
    });

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //Check if email exists, and check for valid password
    const user = await User.findOne({ email });
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!(user && passwordMatched)) {
      return res.json({
        msg: "Wrong email or password",
      });
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
    res.json(error.message);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.authUserId);

    res.json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Users route",
    });
  } catch (error) {
    res.json(error.message);
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
    res.json(error.message);
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
    res.json(error.message);
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
    res.json(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update users route",
    });
  } catch (error) {
    res.json(error.message);
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
      const uploadResponse = await AWSProfilePicUpload(req.file);

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
    res.json(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete users route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  deleteUser,
  follow,
  getAllUsers,
  getProfileViewers,
  getUserProfile,
  login,
  profilePhotoUpload,
  registerUser,
  unfollow,
  updateUser,
};
