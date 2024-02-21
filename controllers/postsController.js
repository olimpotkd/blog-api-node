const Post = require("../model/Post");
const User = require("../model/User");

const createPost = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const author = await User.findById(req.authUserId);

    //Create post
    const postCreated = await Post.create({
      title,
      description,
      user: author.id,
    });

    //Add the created post to user
    author.posts.push(postCreated);

    await author.save();

    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    res.json({
      status: "success",
      data: "Get all posts route",
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const getPost = async (req, res, next) => {
  try {
    res.json({
      status: "success",
      data: "Get single post route",
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const deletePost = async (req, res, next) => {
  try {
    res.json({
      status: "success",
      data: "Delete posts route",
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const updatePost = async (req, res, next) => {
  try {
    res.json({
      status: "success",
      data: "Update post route",
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

module.exports = {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
};
