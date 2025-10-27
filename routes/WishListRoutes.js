const express = require("express");
const Router = express.Router();

const auth = require("../controllers/authControllers");
const WishList = require("../controllers/wishListControlers");

Router.post("/", auth.protect, WishList.addToWishList);
Router.delete("/", auth.protect, WishList.deleteFromWishList);

module.exports = Router;
