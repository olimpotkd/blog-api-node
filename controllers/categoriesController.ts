import { Request, Response, NextFunction } from "express";
import Category from "../model/Category";
import errorHandler from "../util/errorHandler";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;
  try {
    const category = await Category.create({ title, user: req.authUserId });
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.id);
  try {
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categories = await Category.find();

  try {
    res.json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "Category deleted",
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
    },
    { new: true, runValidators: true }
  );
  try {
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

export {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
