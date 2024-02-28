const Category = require("../model/Category");
const errorHandler = require("../util/errorHandler");

const createCategory = async (req, res, next) => {
  const { title } = req.body;
  try {
    const category = await Category.create({ title, user: req.authUserId });
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const getCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  try {
    res.json({
      status: "success",
      data: category,
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const getAllCategories = async (_, res, next) => {
  const categories = await Category.find();

  try {
    res.json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({
      status: "success",
      data: "Category deleted",
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const updateCategory = async (req, res, next) => {
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
    return next(errorHandler(error.message));
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
