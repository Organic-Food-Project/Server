const express = require("express");
const Router = express.Router();
const Cats = require("../controllers/CategoryController");
const auth = require("../controllers/authControllers");

Router.get("/", Cats.getallCategories);
Router.post("/addcategory", auth.protect, Cats.addCategory);
Router.delete("/:name", auth.protect, Cats.deleteCategory);

module.exports = Router;
