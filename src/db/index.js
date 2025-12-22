const mongoose = require('mongoose');
const connectDB = () => {
  return mongoose
  .connect("mongodb://127.0.0.1:27017/myfirstdb")
  .then(() => console.log("Connected to database"))
  .catch((e) => {
    console.error("Error connecting to database", e.message);
  });
};  

module.exports = connectDB;

