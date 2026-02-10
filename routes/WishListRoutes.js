const express = require("express");
const Router = express.Router();

const auth = require("../controllers/authControllers");
const WishList = require("../controllers/wishListControlers");

/**
 * @openapi
 * /api/v1/wishlist:
 *   get:
 *     summary: Get wishlist
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: Wishlist items
 */
Router.get("/", auth.protect, WishList.GetWishList);
/**
 * @openapi
 * /api/v1/wishlist:
 *   post:
 *     summary: Add item to wishlist
 *     tags: [Wishlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Item added to wishlist
 */
Router.post("/", auth.protect, WishList.addToWishList);
/**
 * @openapi
 * /api/v1/wishlist:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 */
Router.delete("/", auth.protect, WishList.deleteFromWishList);

module.exports = Router;
