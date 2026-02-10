const express = require("express");
const Router = express.Router();

const schemas = require("../utils/Validations/UserValidation");
const auth = require("../controllers/authControllers");
const user = require("../controllers/UserControlers");
const validate = require("../middlerwares/validate");
const ImageValidate = require("../middlerwares/Image_Validate");
const upload = require("../middlerwares/multer");
const order = require("../controllers/OrderHistory");

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile
 */
Router.get("/", auth.protect, user.getUser);
/**
 * @openapi
 * /api/v1/users/allusers:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users list
 */
Router.get("/allusers", auth.protect, user.getallusers);
/**
 * @openapi
 * /api/v1/users/orderhistory:
 *   get:
 *     summary: Get order history
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Order history
 */
Router.get("/orderhistory", auth.protect, order.orderHistory);
/**
 * @openapi
 * /api/v1/users/{orderid}:
 *   get:
 *     summary: Get order by id
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
Router.get("/:orderid", auth.protect, order.getOrderById);
//
/**
 * @openapi
 * /api/v1/users/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error
 */
Router.post("/signup", validate(schemas.SignUpSchema), auth.signup);
/**
 * @openapi
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Logged in
 *       401:
 *         description: Invalid credentials
 */
Router.post("/login", validate(schemas.loginSchema), auth.login);
//
/**
 * @openapi
 * /api/v1/users/admindelete:
 *   delete:
 *     summary: Admin delete user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted
 */
Router.delete("/admindelete", auth.protect, user.AdminDeleteUser);
/**
 * @openapi
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted
 */
Router.delete("/delete", auth.protect, user.deleteUser);
//
/**
 * @openapi
 * /api/v1/users/updatepassword:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Password updated
 */
Router.put("/updatepassword", auth.protect, user.UpdatePassword);
/**
 * @openapi
 * /api/v1/users/updateuser:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 */
Router.put(
  "/updateuser",
  auth.protect,
  validate(schemas.UpdateUserSchema),
  user.updateuser,
);
/**
 * @openapi
 * /api/v1/users/updateImage:
 *   put:
 *     summary: Update user profile image
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Image updated
 */
Router.put(
  "/updateImage",
  auth.protect,
  upload.single("profileImage"),
  ImageValidate(false),
  user.UpdateImage,
);
//
module.exports = Router;
