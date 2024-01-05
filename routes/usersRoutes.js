const express = require("express");
const {
  registerUser,
  login,
  getUserProfile,
  deleteUser,
  updateUser,
  getAllUsers,
  profilePhotoUpload,
} = require("../controllers/usersController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const usersRoutes = express.Router();

//POST user register
// /api/v1/users/register
usersRoutes.post("/register", registerUser);

//POST user login
// /api/v1/users/login
usersRoutes.post("/login", login);

//GET user profile
// /api/v1/users/profile/
usersRoutes.get("/profile/", isLoggedIn, getUserProfile);

//DELETE users
// /api/v1/users/:id
usersRoutes.delete("/:id", deleteUser);

//UPDATE user
// /api/v1/users/:id
usersRoutes.put("/:id", updateUser);

//GET users
// /api/v1/users
usersRoutes.get("/", getAllUsers);

//POST user profile
// /api/v1/users/profile-photo-upload/
usersRoutes.post(
  "/profile-photo-upload/",
  isLoggedIn,
  upload.single("profilePic"), //Call middleware, using the name of the param that contains the file
  profilePhotoUpload
);

module.exports = usersRoutes;
