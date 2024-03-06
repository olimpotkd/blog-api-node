import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

// import userRouter from "./routes/usersRoutes";
// import postsRoutes from "./routes/postsRoutes";
// import commentsRoutes from "./routes/commentsRoutes";
// import categoriesRoutes from "./routes/categoriesRoutes";
import wrongURLErrorHandler from "./middlewares/wrongURLErrorHandler";

//dotenv allows for use of the .env file
dotenv.config();

require("./config/dbConnect");

const app: Express = express();

//middlewares
app.use(express.json());

//-------
//routes
//-------

// //users route
// app.use("/api/v1/users", userRouter);

// //posts routes
// app.use("/api/v1/posts", postsRoutes);

// //comments routes
// app.use("/api/v1/comments", commentsRoutes);

// //comments routes
// app.use("/api/v1/categories", categoriesRoutes);

//error handler middleware
app.use(wrongURLErrorHandler);

//404 error
app.use("*", (req, res) => {
  res.status(400).json({
    message: `${req.originalUrl} - Route Not Found`,
  });
});

//listen to server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
