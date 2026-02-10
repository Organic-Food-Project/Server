const express = require("express");
const Router = express.Router();
const comment = require("../controllers/revirew");
const auth = require("../controllers/authControllers");
/**
 * @openapi
 * /api/v1/review:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 */
Router.get("/", comment.getAllReview);
/**
 * @openapi
 * /api/v1/review:
 *   post:
 *     summary: Add a review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Review created
 */
Router.post("/", auth.protect, comment.Addreview);
/**
 * @openapi
 * /api/v1/review:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Review deleted
 */
Router.delete("/", auth.protect, comment.deleteReview);

module.exports = Router;
