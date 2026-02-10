const express = require("express");
const Router = express.Router();
const Cats = require("../controllers/CategoryController");
const auth = require("../controllers/authControllers");
const upload = require("../middlerwares/multer");
const ImageValidate = require("../middlerwares/Image_Validate");

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
Router.get("/", Cats.getallCategories);
/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     summary: Add a category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation error
 */
Router.post(
  "/",
  upload.single("image"),
  ImageValidate(false),
  auth.protect,
  Cats.addCategory,
);
/**
 * @openapi
 * /api/v1/categories/{name}:
 *   delete:
 *     summary: Delete a category by name
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
Router.delete("/:name", auth.protect, Cats.deleteCategory);

module.exports = Router;
