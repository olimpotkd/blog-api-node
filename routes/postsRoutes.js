const express = require("express");
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/postsController");

const postsRoutes = express.Router();

//ADD post
// /api/v1/posts/
postsRoutes.post("/", createPost);

//GET posts
// /api/v1/posts/
postsRoutes.get("/", getAllPosts);

//GET post
// /api/v1/posts/:id
postsRoutes.get("/:id", getPost);

//DELETE posts
// /api/v1/posts/:id
postsRoutes.delete("/:id", deletePost);

//UPDATE posts
postsRoutes.put("/:id", updatePost);

module.exports = postsRoutes;
