const express = require("express");
const Router = express.Router();

const schemas = require("../utils/Validations/UserValidation");
const auth = require("../controllers/authControllers");
const user = require("../controllers/UserControlers");
const AppError = require("../utils/AppError");

Router.post("/signup", AppError.validate(schemas.SignUpSchema), auth.signup);
Router.post("/login", AppError.validate(schemas.loginSchema), auth.login);
Router.delete("/delete", auth.protect, user.deleteUser);
Router.get("/", auth.protect, user.getUser);
Router.put("/updatepassword", auth.protect, user.UpdatePassword);
Router.put("/updateuser", auth.protect, user.updateuser);
//
module.exports = Router;
