const express = require("express");
const Router = express.Router();
const Cats = require("../controllers/CategoryController");
const auth = require("../controllers/authControllers");
const upload = require("../middlerwares/multer");
const ImageValidate = require("../middlerwares/Image_Validate");

Router.get("/", Cats.getallCategories);
Router.post(
  "/",
  upload.single("image"),
  ImageValidate(false),
  auth.protect,
  Cats.addCategory
);
Router.delete("/:name", auth.protect, Cats.deleteCategory);

module.exports = Router;
