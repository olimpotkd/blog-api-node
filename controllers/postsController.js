const createPost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "post creation route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getAllPosts = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get all posts route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const getPost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get single post route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete posts route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

const updatePost = async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update post route",
    });
  } catch (error) {
    res.json(error.message);
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
};
