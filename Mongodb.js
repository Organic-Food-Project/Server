const mongoose = require("mongoose");
const User = require("./modles/userSchema");
require("dotenv").config();
let isconnected;

const connectDB = async (uri) => {
  if (isconnected) return;
  mongoose
    .connect(uri)
    .then(async (conn) => {
      isconnected = conn.connections[0].readyState;
      const user = await User.findOne({ email: process.env.FIRST_ADMIN_EMAIL });
      if (!user) {
        await User.create({
          email: process.env.FIRST_ADMIN_EMAIL,
          password: process.env.FIRST_ADMIN_PASSWORD,
          role: "admin",
        });
      }
      console.log("MongoDB Connected!");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;
