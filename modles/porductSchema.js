const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    images: { type: [String] },
    rate: { type: Number, default: 1.5 },
    price: {
      type: Number,
      required: true,
      min: [1, "Product Can't Go Below 1$"],
      max: [1500, "Product Cant be More Than 1500$"],
    },
    quantity: { type: Number, required: true, default: 5 },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "catogary",
      required: true,
      enum: [
        "Fresh Fruit",
        "Vegetables",
        "Cooking",
        "Snacks",
        "Beverages",
        "Beauty & Health",
        "Bread & Bakery",
      ],
    },
    description: {
      type: String,
      required: true,
      default:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo placeat velit reiciendis praesentium, quasi cum, eaque necessitatibus labore magni id quaerat! Officia nam dicta, quam deleniti ipsum neque fuga laboriosam.",
    },
  },
  {
    timestamps: true,
  }
);

exports.Products = mongoose.model("Product", ProductSchema);
