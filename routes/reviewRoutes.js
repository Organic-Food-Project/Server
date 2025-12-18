const express = require("express");
const Router = express.Router();
const comment = require("../controllers/revirew");
const auth = require("../controllers/authControllers");
Router.get("/", comment.getAllReview);
Router.post("/", auth.protect, comment.Addreview);
Router.delete("/", auth.protect, comment.deleteReview);

module.exports = Router;
