const express = require("express");
const Router = express.Router();

const schemas = require("../utils/Validations/UserValidation");
const auth = require("../controllers/authControllers");
const user = require("../controllers/UserControlers");
const validate = require("../middlerwares/validate");
const ImageValidate = require("../middlerwares/Image_Validate");
const upload = require("../middlerwares/multer");
const order = require("../controllers/OrderHistory");

Router.get("/", auth.protect, user.getUser);
Router.get("/allusers", auth.protect, user.getallusers);
Router.get("/orderhistory", auth.protect, order.orderHistory);
Router.get("/:orderid", auth.protect, order.getOrderById);
//
Router.post("/signup", validate(schemas.SignUpSchema), auth.signup);
Router.post("/login", validate(schemas.loginSchema), auth.login);
//
Router.delete("/admindelete", auth.protect, user.AdminDeleteUser);
Router.delete("/delete", auth.protect, user.deleteUser);
//
Router.put("/updatepassword", auth.protect, user.UpdatePassword);
Router.put(
  "/updateuser",
  auth.protect,
  validate(schemas.UpdateUserSchema),
  user.updateuser
);
Router.put(
  "/updateImage",
  auth.protect,
  upload.single("profileImage"),
  ImageValidate(false),
  user.UpdateImage
);
//
module.exports = Router;
