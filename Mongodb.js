const mongoose = require("mongoose");
let isconnected;

const connectDB = async (uri) => {
  if (isconnected) return;
  mongoose
    .connect(uri)
    .then((conn) => {
      isconnected = conn.connections[0].readyState;
      console.log("MongoDB Connected!");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;
