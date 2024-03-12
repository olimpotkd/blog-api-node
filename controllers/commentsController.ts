import { Request, Response, NextFunction } from "express";
import Comment from "../model/Comment";
import Post from "../model/Post";
import User from "../model/User";
import errorHandler from "../util/errorHandler";

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.authUserId);

    if (!post || !user) {
      return next(errorHandler("Invalid Post or User", 400));
    }

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
    next(errorHandler("Hey"));
  }
};

const getComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = Comment.findById(req.params.id);

    res.json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const getAllComments = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const comments = Comment.find();
  try {
    res.json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(errorHandler("Comment not found", 400));
    }

    if (comment.user.toString() !== req.authUserId!.toString()) {
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
    next(errorHandler((error as Error).message));
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(errorHandler("Comment not found", 400));
    }

    if (comment.user.toString() !== req.authUserId) {
      return next(errorHandler("Not authorized to delete", 403));
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      data: "Comment deleted",
    });
  } catch (error) {
    next(errorHandler((error as Error).message));
  }
};

export {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
