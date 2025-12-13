const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.ObjectId,
        required: [true, "A Payment must have products"],
        ref: "Product",
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "A Payment must hvae a user"],
      ref: "User",
    },
    total: {
      type: Number,
      required: [true, "A Payment must hvae a price"],
    },
  },
  { timestamps: true }
);
const Payment = mongoose.model("payment", PaymentSchema);

module.exports = Payment;
