import express from "express";
import {
  registerUser,
  login,
  getUserProfile,
  deleteUser,
  updateUser,
  getAllUsers,
  profilePhotoUpload,
  getProfileViewers,
  unfollow,
  follow,
  blockUser,
  unblockUser,
  adminBlockUser,
  adminUnblockUser,
  updatePassword,
} from "../controllers/usersController";
import { isLoggedIn, isAdmin } from "../middlewares";

import multer from "multer";

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
// /api/v1/users/profile
usersRoutes.get("/profile/", isLoggedIn, getUserProfile);

//UPDATE password
// /api/v1/users/update-password
usersRoutes.put("/update-password", isLoggedIn, updatePassword);

//DELETE users
// /api/v1/users/:id
usersRoutes.delete("/:id", deleteUser);

//UPDATE user
// /api/v1/users/:id
usersRoutes.put("/", isLoggedIn, updateUser);

//GET users
// /api/v1/users
usersRoutes.get("/", getAllUsers);

//GET unfollow
// /api/v1/users/:id/unfollow
usersRoutes.get("/:id/unfollow", isLoggedIn, unfollow);

//GET follow
// /api/v1/users/:id/following
usersRoutes.get("/:id/follow", isLoggedIn, follow);

//GET block user
// /api/v1/users/:id/block
usersRoutes.get("/:id/block", isLoggedIn, blockUser);

//GET unblock user
// /api/v1/users/:id/unblock
usersRoutes.get("/:id/unblock", isLoggedIn, unblockUser);

//PUT block user
// /api/v1/users/:id/adminBlock
usersRoutes.put("/:id/adminBlock", isLoggedIn, isAdmin, adminBlockUser);

//PUT unblock user
// /api/v1/users/:id/adminUnblock
usersRoutes.put("/:id/adminUnblock", isLoggedIn, isAdmin, adminUnblockUser);

//GET users
// /api/v1/users/profile-viewers
usersRoutes.get("/:id/profile-viewers", isLoggedIn, getProfileViewers);

//DELETE user
// /api/v1/users/:id
usersRoutes.delete("/", isLoggedIn, deleteUser);

// POST user profile
// /api/v1/users/profile-photo-upload/
usersRoutes.post(
  "/profile-photo-upload",
  isLoggedIn,
  upload.single("profilePhoto"), //Call middleware, using the name of the param that contains the file
  profilePhotoUpload
);

export default usersRoutes;
