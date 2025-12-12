const Router = require("express").Router();
const auth = require("../controllers/authControllers");
const {
  createContactUs,
  getContactUs,
} = require("../controllers/ContactUsControl");

Router.post("/", createContactUs);
Router.get("/", auth.protect, getContactUs);

module.exports = Router;
