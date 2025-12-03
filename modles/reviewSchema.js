const mongoose = require("mongoose");
const commentsSchema = mongoose.Schema(
  {
    userID: { type: mongoose.Schema.ObjectId, required: true },
    productID: { type: mongoose.Schema.ObjectId, required: true },
    comment: { type: String, required: true },
    rate: { type: Number, default: 5, required: true },
  },
  { timestamps: true }
);
commentsSchema.pre(/^find/, () => {
  this.populate({ path: "productID", select: "_id name" });
  this.populate({ path: "userID", select: "_id firstName lastName" });
});
exports.reviews = mongoose.model("review", commentsSchema);
