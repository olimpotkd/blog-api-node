const Post = require("../model/Post");
const User = require("../model/User");
const AWSFileUpload = require("../util/AWSUtility");
const AWSDirectories = require("../util/constants");
const errorHandler = require("../util/errorHandler");

const createPost = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    const author = await User.findById(req.authUserId);

    // Check if author is blocked
    if (author.isBlocked) {
      return next(errorHandler("Access denied. Account blocked.", 403));
    }

    //Create post
    const postCreated = await Post.create({
      title,
      description,
      user: author.id,
      category,
    });

    //Upload photo to AWS
    if (req.file) {
      const uploadResponse = await AWSFileUpload(
        req.file,
        postCreated.id,
        AWSDirectories.postPhotos
      );

      //Update post with photo route
      postCreated.photo = uploadResponse.Location;
      await postCreated.save();
    }

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

const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.includes(req.authUserId)) {
      post.likes = post.likes.filter((id) => id.toString() !== req.authUserId);
    } else {
      post.likes.push(req.authUserId);
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== req.authUserId
      );
    }

    await post.save();

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const toggleDislikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.dislikes.includes(req.authUserId)) {
      post.dislikes = post.dislikes.filter(
        (like) => like.toString() !== req.authUserId
      );
    } else {
      post.dislikes.push(req.authUserId);
      post.likes = post.likes.filter((id) => id.toString() !== req.authUserId);
    }

    await post.save();

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const getAllPosts = async (req, res, next) => {
  // Get all the posts excluding the ones from the users blocked
  const allPosts = await Post.find({})
    .populate("user")
    .populate("category", "title");

  const filterededPosts = allPosts.filter(
    (p) => !p.user.blocked.includes(req.authUserId)
  );
  try {
    res.json({
      status: "success",
      data: filterededPosts,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.viewers.includes(req.authUserId)) {
      post.viewers.push(req.authUserId);
      await post.save();
    }

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.authUserId.toString()) {
      return next(errorHandler("Not allowed to delete post.", 403));
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      data: "Post deleted",
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

const updatePost = async (req, res, next) => {
  try {
    if (req.file) {
      await AWSFileUpload(req.file, postCreated.id, AWSDirectories.postPhotos);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      status: "success",
      data: updatedPost,
    });
  } catch (error) {
    next(errorHandler(error.message));
  }
};

module.exports = {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  toggleDislikePost,
  toggleLikePost,
  updatePost,
};
