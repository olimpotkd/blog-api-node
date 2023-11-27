const express = require("express");
const dotenv = require("dotenv");

//dotenv allows for use of the .env file
dotenv.config();

require("./config/dbConnect");

const app = express();

//middlewares
//routes
//error handler middleware
//listen to server
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running on ${PORT}`));
