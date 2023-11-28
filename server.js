const express = require("express");
const dotenv = require("dotenv");

//dotenv allows for use of the .env file
dotenv.config();

require("./config/dbConnect");

const app = express();

//middlewares
//-------
//routes
//-------

//users route

//POST user register
app.post("/api/v1/users/register", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "user registered",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//POST user login
app.post("/api/v1/users/login", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "user login",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET user profile
app.get("/api/v1/users/profile/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Profile route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET users
app.get("/api/v1/users", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Users route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//DELETE users
app.delete("/api/v1/users/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete users route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//UPDATE user
app.put("/api/v1/users/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update users route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//-----------
//posts route
//-----------

//ADD post
app.post("/api/v1/posts", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "post creation route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET posts
app.get("/api/v1/posts", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get all posts route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET post
app.get("/api/v1/posts/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get single post route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//DELETE posts
app.delete("/api/v1/posts/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete posts route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//UPDATE posts
app.put("/api/v1/posts/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update post route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//---------------
//comments route
//---------------

//ADD comment
app.post("/api/v1/comments", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "comment creation route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET single comment
app.get("/api/v1/comments/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get single comment route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET comments
app.get("/api/v1/comments", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get comments route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//DELETE comments
app.delete("/api/v1/comments/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete comments route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//UPDATE comments
app.put("/api/v1/comments/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update comment route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//----------------
//categories route
//----------------

//ADD category
app.post("/api/v1/categories", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "category creation route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET single category
app.get("/api/v1/categories/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get single category route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//GET all categories
app.get("/api/v1/categories", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Get all categories route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//DELETE categories
app.delete("/api/v1/categories/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Delete category route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//UPDATE categories
app.put("/api/v1/categories/:id", async (req, res) => {
  try {
    res.json({
      status: "success",
      data: "Update category route",
    });
  } catch (error) {
    res.json(error.message);
  }
});

//error handler middleware
//listen to server
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running on ${PORT}`));
