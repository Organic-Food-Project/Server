const express = require("express");
const Router = express.Router();
const Products = require("../controllers/ProductControllers");
const auth = require("../controllers/authControllers");
//
Router.get("/", Products.getAllProducts);
Router.get("/:name", Products.getProductByName);
Router.post("/", auth.protect, Products.addNewProduct);
Router.delete("/:name", auth.protect, Products.deleteProduct);

module.exports = Router;
