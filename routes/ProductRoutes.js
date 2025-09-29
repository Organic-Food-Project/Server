const express = require("express");
const Router = express.Router();
const Products = require("../controllers/ProductControllers");
const auth = require("../controllers/authControllers");
const ImageValidate = require("../middlerwares/Image_Validate");
const upload = require("../middlerwares/multer");
const UploadImage = require("../middlerwares/Image_kit");
//
Router.get("/", Products.getAllProducts);
Router.get("/:name", Products.getProductByName);
Router.post(
  "/",
  auth.protect,
  upload.array("ProductImages", 4),
  ImageValidate(true),
  UploadImage(true),
  Products.addNewProduct
);
Router.delete("/:name", auth.protect, Products.deleteProduct);

module.exports = Router;
