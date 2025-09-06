const express = require("express");
const app = express();
require("dotenv").config();

app.listen(process.env.PORT, () => {
  console.log("Server Started On Port: " + process.env.PORT);
});
