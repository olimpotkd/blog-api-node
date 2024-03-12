import express from "express";
import {
  createCategory,
  getCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/categoriesController";
import isLoggedIn from "../middlewares/isLoggedIn";

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

export default categoriesRoutes;
