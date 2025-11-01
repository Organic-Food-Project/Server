const express = require("express");
const Router = express.Router();
const controler = require("../controllers/CartControlerrs");
const auth = require("../controllers/authControllers");
// Cart
Router.post("/", auth.protect, controler.AddToCart);
Router.patch("/", auth.protect, controler.UpdateCart);
Router.delete("/", auth.protect, controler.DeleteFromCart);
Router.get("/", auth.protect, controler.Getcart);
module.exports = Router;
