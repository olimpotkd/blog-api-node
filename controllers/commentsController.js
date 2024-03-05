const Comment = require("../model/Comment");
const Post = require("../model/Post");
const User = require("../model/User");
const errorHandler = require("../util/errorHandler");

const createComment = async (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);
    const user = User.findById(req.authUserId);

    const comment = await Comment.create({
      post: post.id,
      user: req.authUserId,
      text: req.body.text,
    });

    post.comments.push(comment.id);
    user.comments.push(comment.id);

    await Promise.all([post.save(), user.save()]);

    res.json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const getComment = async (req, res, next) => {
  try {
    const comment = Comment.findById(req.params.id);

    res.json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const getAllComments = async (_, res, next) => {
  const comments = Comment.find();
  try {
    res.json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = Comment.findById(req.params.id);

    if (comment.user.toString() !== req.authUserId.toString()) {
      return next(errorHandler("Not authorized to edit", 403));
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      status: "success",
      data: updatedComment,
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = Comment.findById(req.params.id);

    if (comment.user.toString() !== req.authUserId.toString()) {
      return next(errorHandler("Not authorized to delete", 403));
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      data: "Comment deleted",
    });
  } catch (error) {
    return next(errorHandler(error.message));
  }
};

module.exports = {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
