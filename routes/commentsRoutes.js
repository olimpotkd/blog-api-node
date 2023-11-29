const express = require("express");
const {
  createComment,
  getComment,
  getAllComments,
  deleteComment,
  updateComment,
} = require("../controllers/commentsController");

const commentsRoutes = express.Router();

//ADD comment
// /api/v1/comments
commentsRoutes.post("/", createComment);

//GET single comment
// /api/v1/comments/:id
commentsRoutes.get("/:id", getComment);

//GET comments
// /api/v1/comments
commentsRoutes.get("/", getAllComments);

//DELETE comments
// /api/v1/comments/:id
commentsRoutes.delete("/:id", deleteComment);

//UPDATE comments
// /api/v1/comments/:id
commentsRoutes.put("/:id", updateComment);

module.exports = commentsRoutes;
