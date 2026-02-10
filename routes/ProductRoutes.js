const express = require("express");
const Router = express.Router();
const Products = require("../controllers/ProductControllers");
const auth = require("../controllers/authControllers");
const ImageValidate = require("../middlerwares/Image_Validate");
const upload = require("../middlerwares/multer");
/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
Router.get("/", Products.getAllProducts);
/**
 * @openapi
 * /api/v1/products/{name}:
 *   get:
 *     summary: Get product by name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
Router.get("/:name", Products.getProductByName);
/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 */
Router.post(
  "/",
  auth.protect,
  upload.array("ProductImages", 4),
  ImageValidate(true),
  Products.addNewProduct,
);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
Router.delete("/:id", auth.protect, Products.deleteProduct);
/**
 * @openapi
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
Router.patch("/:id", auth.protect, Products.updateProduct);

module.exports = Router;
