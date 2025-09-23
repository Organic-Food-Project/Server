const express = require("express");
const Router = express.Router();
const Cats = require("../controllers/CategoryController");
const auth = require("../controllers/authControllers");

Router.get("/allcategories", auth.protect, Cats.getallCategories);
Router.post("/addcategory", auth.protect, Cats.addCategory);
Router.delete("/deletecategory", auth.protect, Cats.deleteCategory);

module.exports = Router;
