const Router = require("express").Router();
const auth = require("../controllers/authControllers");
const {
  createContactUs,
  getContactUs,
} = require("../controllers/ContactUsControl");

/**
 * @openapi
 * /api/v1/contactUs:
 *   post:
 *     summary: Create contact us message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Message created
 */
Router.post("/", createContactUs);
/**
 * @openapi
 * /api/v1/contactUs:
 *   get:
 *     summary: Get contact us messages
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Messages list
 */
Router.get("/", auth.protect, getContactUs);

module.exports = Router;
