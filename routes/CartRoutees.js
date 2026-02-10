const express = require("express");
const Router = express.Router();
const controler = require("../controllers/CartControlerrs");
const auth = require("../controllers/authControllers");
// Cart
/**
 * @openapi
 * /api/v1/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 */
Router.post("/", auth.protect, controler.AddToCart);
/**
 * @openapi
 * /api/v1/cart:
 *   patch:
 *     summary: Update cart item
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Cart updated
 *       400:
 *         description: Validation error
 */
Router.patch("/", auth.protect, controler.UpdateCart);
/**
 * @openapi
 * /api/v1/cart:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Item removed
 *       404:
 *         description: Item not found
 */
Router.delete("/", auth.protect, controler.DeleteFromCart);
/**
 * @openapi
 * /api/v1/cart:
 *   get:
 *     summary: Get current cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart details
 */
Router.get("/", auth.protect, controler.Getcart);
module.exports = Router;
