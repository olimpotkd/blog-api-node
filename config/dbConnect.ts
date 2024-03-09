import mongoose from "mongoose";

//Helper function to connect to mongo db
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("DB connected!");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

dbConnect();
