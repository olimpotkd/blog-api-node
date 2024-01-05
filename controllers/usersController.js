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
  registerUser,
  login,
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  profilePhotoUpload,
};
