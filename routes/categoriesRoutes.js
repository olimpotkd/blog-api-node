const express = require("express");
const {
  createCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} = require("../controllers/categoriesController");

const categoriesRoutes = express.Router();

//ADD category
// /api/v1/categories
categoriesRoutes.post("/", createCategory);

//GET single category
// /api/v1/categories/:id
categoriesRoutes.get("/:id", getCategory);

//GET all categories
// /api/v1/categories
categoriesRoutes.get("/", getAllCategories);

//DELETE categories
// /api/v1/categories/:id
categoriesRoutes.delete("/:id", deleteCategory);

//UPDATE categories
// /api/v1/categories/:id
categoriesRoutes.put("/:id", updateCategory);

module.exports = categoriesRoutes;
