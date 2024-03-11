import { Request, Response, NextFunction } from "express";
import Post from "../model/Post";
import User from "../model/User";
import AWSFileUpload from "../util/AWSUtility";
import AWSDirectories from "../util/constants";
import errorHandler from "../util/errorHandler";
import mongoose, { Types } from "mongoose";
import { IUser } from "../model/interfaces/";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, category } = req.body;
  try {
    const author = await User.findById(req.authUserId);

    if (!author) {
      return next(errorHandler("Invalid user.", 400));
    }

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
    author.posts.push(postCreated.id);

    await author.save();

    res.json({
      status: "success",
      data: postCreated,
    });
  } catch (error) {
    next(errorHandler(<Error | string>error));
  }
};

const toggleLikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(errorHandler("Invalid post", 400));
    }

    if (
      post?.likes.findIndex((like) => like.toString() === req.authUserId) >= 0 //Check if current user has already liked
    ) {
      post.likes = post.likes.filter((id) => id.toString() !== req.authUserId);
    } else {
      post.likes.push(new Types.ObjectId(req.authUserId as string));
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
    next(errorHandler(<Error | string>error));
  }
};

const toggleDislikePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(errorHandler("Invalid post", 400));
    }

    if (
      post.dislikes.findIndex((dlike) => dlike.toString() === req.authUserId) >=
      0
    ) {
      post.dislikes = post.dislikes.filter(
        (like) => like.toString() !== req.authUserId
      );
    } else {
      post.dislikes.push(new Types.ObjectId(<string>req.authUserId));
      post.likes = post.likes.filter((id) => id.toString() !== req.authUserId);
    }

    await post.save();

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(errorHandler(<Error | string>error));
  }
};

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  // Get all the posts excluding the ones from the users blocked
  const allPosts = await Post.find({})
    .populate<{ user: IUser }>("user")
    .populate("category", "title");

  const filterededPosts = allPosts.filter(
    (p) =>
      !p.user.blocked.some((id) => id.toString() === <string>req.authUserId)
  );
  try {
    res.json({
      status: "success",
      data: filterededPosts,
    });
  } catch (error) {
    next(errorHandler(<Error | string>error));
  }
};

const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(errorHandler("Invalid post", 400));
    }

    if (post.viewers.findIndex((v) => v.toString() === req.authUserId) < 0) {
      post.viewers.push(new Types.ObjectId(<string>req.authUserId));
      await post.save();
    }

    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    next(errorHandler(<Error | string>error));
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(errorHandler("Post not found.", 400));
    }

    if (post?.user.toString() !== req.authUserId) {
      return next(errorHandler("Not allowed to delete post.", 403));
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      data: "Post deleted",
    });
  } catch (error) {
    next(errorHandler(<Error | string>error));
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params.id;
  const {
    title,
    description,
    category,
  }: { title: string; description: string; category: string } = req.body;

  try {
    if (req.file) {
      await AWSFileUpload(req.file, postId, AWSDirectories.postPhotos);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
        category,
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
    next(errorHandler(<Error | string>error));
  }
};

export {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  toggleDislikePost,
  toggleLikePost,
  updatePost,
};
