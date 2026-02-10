require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const limiter = require("./utils/rateLimter");
const UserRouter = require("./routes/userRoutes");
const ProductRouter = require("./routes/ProductRoutes");
const CartRouter = require("./routes/CartRoutees");
const CategoryRouter = require("./routes/CategoryRoutes");
const ContactUsRouter = require("./routes/contactRoutes");
const WishListRouter = require("./routes/WishListRoutes");
const analyticsRouter = require("./routes/AnalyticsRoutes");
const ReviewRouter = require("./routes/reviewRoutes");
const CheckoutRouter = require("./routes/CheckoutRoutes");
const checkoutController = require("./controllers/checkoutControllers");
const connectDB = require("./Mongodb");
const cors = require("cors");
const morgan = require("morgan");
const uri = process.env.MONGODB_URI.replace(
  "<db_password>",
  process.env.ATLAS_PASSWORD,
);
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Organic Food Backend Docs",
      version: "1.0.0",
      description:
        "This is the documentation for the backend part of Ecofila / organic food",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT}` },
      { url: "https://organicfood-server.vercel.app/" },
    ],
  },
  apis: ["./routes/*.js"],
};
const openApiSpec = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  checkoutController.Webhook_checkout,
);

app.set("query parser", "extended");
app.use(express.json());
app.use(morgan("combined"));
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(limiter);
app.use(
  cors({
    origin: ["http://localhost:3000", `${process.env.FrontEnd}`],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  }),
);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/wishlist", WishListRouter);
app.use("/api/v1/checkout", CheckoutRouter);
app.use("/api/v1/contactUs", ContactUsRouter);
app.use("/api/v1/review", ReviewRouter);
app.get("/", (req, res) => {
  res.send("Server Running");
});
connectDB(uri);
app.use((err, req, res, next) => {
  console.error(err.stack);
  switch (err.name) {
    case "JsonWebTokenError": {
      err.statusCode = 401;
      break;
    }
    case "TokenExpiredError": {
      err.statusCode = 401;
      break;
    }
    case "ValidationError": {
      err.statusCode = 400;
      break;
    }
  }
  if (err.message.includes("jwt")) {
    err.statusCode = 401;
  }
  const status = err.statusCode || 500;
  const message = err.message || "Internal Error";
  res.status(status).json({ message });
});

module.exports = app;

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT, () => {
    console.log(`local on port ${process.env.PORT}`);
  });
}
