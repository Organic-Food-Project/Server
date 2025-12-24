const { rateLimit } = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  statusCode: 429,
  message: { error: "You have Reached the limit of 100 requests per 15min" },
  handler: (req, res) => {
    res.status(429).json({
      status: "Failed",
      error: "You Have Reached the Limit try again in 15min",
    });
  },
});

module.exports = limiter;
