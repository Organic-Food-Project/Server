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
    price: {
      type: Number,
      required: [true, "A Payment must hvae a price"],
    },
  },
  { timestamps: true }
);
PaymentSchema.pre(/^find/, function () {
  this.populate("user").populate("products");
});
const Payment = mongoose.model("payment", PaymentSchema);

module.exports = Payment;
