const express = require("express");
const Router = express.Router();

const schemas = require("../utils/Validations/UserValidation");
const auth = require("../controllers/authControllers");
const user = require("../controllers/UserControlers");
const validate = require("../middlerwares/validate");
const ImageValidate = require("../middlerwares/Image_Validate");
const upload = require("../middlerwares/multer");
const UploadImage = require("../middlerwares/Image_kit");

Router.get("/", auth.protect, user.getUser);
Router.get("/allusers", auth.protect, user.getallusers);
//
Router.post("/signup", validate(schemas.SignUpSchema), auth.signup);
Router.post("/login", validate(schemas.loginSchema), auth.login);
//
Router.delete("/admindelete", auth.protect, user.AdminDeleteUser);
Router.delete("/delete", auth.protect, user.deleteUser);
//
Router.put("/updatepassword", auth.protect, user.UpdatePassword);
Router.put("/updateuser", auth.protect, user.updateuser);
Router.put(
  "/updateImage",
  upload.single("profileImage"),
  ImageValidate(false),
  UploadImage(false),
  auth.protect,
  user.UpdateImage
);
//
module.exports = Router;
