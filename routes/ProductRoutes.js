const express = require("express");
const Router = express.Router();
const Products = require("../controllers/ProductControllers");
const auth = require("../controllers/authControllers");
//
Router.get("/getAllProducts", Products.getAllProducts);
Router.get("/getProductByName", Products.getProductByName);
Router.post("/AddProduct", auth.protect, Products.addNewProduct);
Router.delete("/deleteProduct", auth.protect, Products.deleteProduct);

module.exports = Router;
