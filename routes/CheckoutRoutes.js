const express = require("express");
const Router = express.Router();
const controler = require("../controllers/checkoutControllers");
const auth = require("../controllers/authControllers");

Router.get("/", auth.protect, controler.checkout);
module.exports = Router;
