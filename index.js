require("dotenv").config();
const express = require("express");
const app = express();
const UserRouter = require("./routes/userRoutes");
const mongoose = require("mongoose");
const connectDB = require("./Mongodb");
const uri = process.env.MONGODB_URI.replace(
  "<db_password>",
  process.env.ATLAS_PASSWORD
);
app.use(express.json());
app.use("/api/v1/users", UserRouter);

app.get("/", (req, res) => {
  res.send("Hello WOrld");
});
connectDB(uri);
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  const message = err.message || "Internal Error";
  res.status(status).json({ message });
});

module.exports = app;
