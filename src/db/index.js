import mongoose from "mongoose";
const connectDB = async() => {
    return mongoose
    .connect("mongodb://127.0.0.1:27017/myfirstdb")
    .then(() => {
      console.log(" Database connected successfully");
    })
    .catch((err) => {
      console.error("connection error:", err.message);
    });
};
export default connectDB;

