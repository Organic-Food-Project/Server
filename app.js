require("dotenv").config();
const express = require("express");
const app = express();
const UserRouter = require("./routes/userRoutes");
const mongoose = require("mongoose");
app.use(express.json());
app.use("/api/v1/users", UserRouter);

app.get("/", (req, res) => {
  res.send("Hello WOrld");
});

mongoose
  .connect(`mongodb://127.0.0.1:${process.env.MONGODB_PORT}/organicFood`)
  .then((conn) => {
    console.log("MongoDB Connected!");
    app.listen(process.env.PORT, (err) => {
      if (err) console.log(err);
      console.log("Server Started On Port: " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1)
  });
