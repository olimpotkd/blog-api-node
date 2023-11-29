const createCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Create category route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get single category route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getAllCategories = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get all categories route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete category route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update category route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
