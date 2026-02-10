const express = require("express");
const Router = express.Router();
const controler = require("../controllers/checkoutControllers");
const auth = require("../controllers/authControllers");

/**
 * @openapi
 * /api/v1/checkout:
 *   get:
 *     summary: Create checkout session
 *     tags: [Checkout]
 *     responses:
 *       200:
 *         description: Checkout session created
 *       401:
 *         description: Unauthorized
 */
Router.get("/", auth.protect, controler.checkout);
module.exports = Router;
