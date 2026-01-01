const mongoose = require("mongoose");
const checkoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "paid", "expired", "cancelled"],
      default: "pending",
      index: true,
    },

    stripeSessionId: {
      type: String,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60, // ⬅️ auto-delete after 1 hour (optional but recommended)
    },
  },
  { timestamps: true }
);

const checkoutSession = mongoose.model(
  "checkoutSession",
  checkoutSessionSchema
);
module.exports = checkoutSession;
