const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
  {
    products: [
      {
        productID: {
          type: mongoose.Schema.ObjectId,
          required: [true, "A Payment must have productID"],
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: [true, "A Payment must have quantity"],
        },
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
