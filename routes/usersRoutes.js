const express = require("express");
const {
  registerUser,
  login,
  getUserProfile,
  deleteUser,
  updateUser,
  getAllUsers,
} = require("../controllers/usersController");
const isLoggedIn = require("../middlewares/isLoggedIn");

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

module.exports = usersRoutes;
