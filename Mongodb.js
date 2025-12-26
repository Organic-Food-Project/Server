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
      console.log("MongoDB Connected!");

      // Create admin user if doesn't exist
      try {
        const adminEmail = process.env.FIRST_ADMIN_EMAIL;
        if (!adminEmail) {
          console.warn("Admin email not configured in environment variables");
          return;
        }

        const user = await User.findOne({ email: adminEmail });
        if (!user) {
          await User.create({
            firstName: process.env.FIRST_ADMIN_FIRSTNAME || "Admin",
            lastName: process.env.FIRST_ADMIN_LASTNAME || "User",
            email: adminEmail,
            password: process.env.FIRST_ADMIN_PASSWORD,
            role: "admin",
          });
          console.log("Admin user created successfully");
        }
      } catch (error) {
        console.error("Error creating admin user:", error.message);
      }
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

module.exports = connectDB;
