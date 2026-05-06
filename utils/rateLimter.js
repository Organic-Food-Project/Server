const parseForwarded = require("forwarded-parse");
const { rateLimit, keyGenerator } = require("express-rate-limit");
const limiter = rateLimit({
  keyGenerator: (req, res) => {
    let ip = req.ip;
    try {
      const forwards = parseForwarded(req.headers.forwarded);
      ip = forwards[forwards.length - NUMBER_OF_PROXIES_TO_TRUST].for;
    } catch (ex) {
      console.error(
        `Error parsing Forwarded header ${req.headers.forwarded} from ${req.ip}:`,
        ex,
      );
    }
    return ipKeyGenerator(ip);
  },
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: "Failed",
      error: "You Have Reached the Limit try again in 15min",
    });
  },
});

module.exports = limiter;

// rateLimit({
// keyGenerator: (req, res) => {
// let ip = req.ip
// try {
// const forwards = parseForwarded(req.headers.forwarded)
// ip = forwards[forwards.length - NUMBER_OF_PROXIES_TO_TRUST].for
// } catch (ex) {
// console.error(
// `Error parsing Forwarded header ${req.headers.forwarded} from ${req.ip}:`,
// ex,
// )
// }
// return ipKeyGenerator(ip)
// },

// }),
