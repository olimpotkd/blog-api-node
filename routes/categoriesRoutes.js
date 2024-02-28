const express = require("express");
const {
  createCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoriesController");
const isLoggedIn = require("../middlewares/isLoggedIn");

const categoriesRoutes = express.Router();

//ADD category
// /api/v1/categories
categoriesRoutes.post("/", isLoggedIn, createCategory);

//GET single category
// /api/v1/categories/:id
categoriesRoutes.get("/:id", isLoggedIn, getCategory);

//GET all categories
// /api/v1/categories
categoriesRoutes.get("/", isLoggedIn, getAllCategories);

//DELETE categories
// /api/v1/categories/:id
categoriesRoutes.delete("/:id", deleteCategory);

//UPDATE categories
// /api/v1/categories/:id
categoriesRoutes.put("/:id", isLoggedIn, updateCategory);

module.exports = categoriesRoutes;
