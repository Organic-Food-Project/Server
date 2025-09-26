const express = require("express");
const Router = express.Router();

const schemas = require("../utils/Validations/UserValidation");
const auth = require("../controllers/authControllers");
const user = require("../controllers/UserControlers");
const validate = require("../middlerwares/validate");

Router.post("/signup", validate(schemas.SignUpSchema), auth.signup);
Router.post("/login", validate(schemas.loginSchema), auth.login);
Router.delete("/admindelete", auth.protect, user.AdminDeleteUser);
Router.delete("/delete", auth.protect, user.deleteUser);
Router.get("/", auth.protect, user.getUser);
Router.put("/updatepassword", auth.protect, user.UpdatePassword);
Router.put("/updateuser", auth.protect, user.updateuser);
Router.get("/allusers", auth.protect, user.getallusers);
//
module.exports = Router;
