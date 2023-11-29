const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/usersRoutes");
const postsRoutes = require("./routes/postsRoutes");
const commentsRoutes = require("./routes/commentsRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");

//dotenv allows for use of the .env file
dotenv.config();

require("./config/dbConnect");

const app = express();

//middlewares
//-------
//routes
//-------

//users route
app.use("/api/v1/users", userRouter);

//posts routes
app.use("/api/v1/posts", postsRoutes);

//comments routes
app.use("/api/v1/comments", commentsRoutes);

//comments routes
app.use("/api/v1/categories", categoriesRoutes);

//error handler middleware

//listen to server
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running on ${PORT}`));
