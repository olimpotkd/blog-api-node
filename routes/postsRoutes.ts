import express from "express";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  toggleLikePost,
  deletePost,
  toggleDislikePost,
} from "../controllers/postsController";
import isLoggedIn from "../middlewares/isLoggedIn";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

const postsRoutes = express.Router();

//ADD post
// /api/v1/posts/
postsRoutes.post(
  "/",
  isLoggedIn,
  upload.single("photo"), //Call middleware, using the name of the param that contains the file
  createPost
);

//GET posts
// /api/v1/posts/
postsRoutes.get("/", isLoggedIn, getAllPosts);

//GET post
// /api/v1/posts/:id
postsRoutes.get("/:id", isLoggedIn, getPost);

//DELETE posts
// /api/v1/posts/:id
postsRoutes.delete("/:id", isLoggedIn, deletePost);

//UPDATE posts
postsRoutes.put("/:id", isLoggedIn, upload.single("photo"), updatePost);

//Like a post
postsRoutes.put("/:id/likes", isLoggedIn, toggleLikePost);

//Dislike post
postsRoutes.put("/:id/dislikes", isLoggedIn, toggleDislikePost);

export default postsRoutes;
