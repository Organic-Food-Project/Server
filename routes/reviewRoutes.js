const express = require("express");
const Router = express.Router();
const comment = require("../controllers/revirew");
const auth = require("../controllers/authControllers");
Router.get("/", auth.protect, comment.getAllReview);
Router.post("/", auth.protect, comment.Addreview);
Router.delete("/", auth.protect, comment.deleteReview);

module.exports = Router;
