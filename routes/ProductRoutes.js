const express = require("express");
const Router = express.Router();
const Products = require("../controllers/ProductControllers");
const auth = require("../controllers/authControllers");
const ImageValidate = require("../middlerwares/Image_Validate");
const upload = require("../middlerwares/multer");
//
Router.get("/", Products.getAllProducts);
Router.get("/:name", Products.getProductByName);
Router.post(
  "/",
  auth.protect,
  upload.array("ProductImages", 4),
  ImageValidate(true),
  Products.addNewProduct
);
Router.delete("/:id", auth.protect, Products.deleteProduct);
Router.patch("/:id", auth.protect, Products.updateProduct);

module.exports = Router;
