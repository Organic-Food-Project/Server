const mongoose = require("mongoose");
const commentsSchema = mongoose.Schema(
  {
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    rate: { type: Number, default: 1 },
  },
  { timestamps: true }
);
const ProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => {
          return arr.length > 0;
        },
        message: "Image Can not Be Empty",
      },
    },
    rate: { type: Number, default: 1.5 },
    price: { type: Number, required: true, default: 16.5 },
    quantity: { type: Number, required: true, default: 5 },
    category: {
      type: String,
      required: true,
      enum: [
        "Fresh_Fruit",
        "Vegetables",
        "Cooking",
        "Snacks",
        "Beverages",
        "Beauty & Health",
        "Bread & Bakery",
      ],
    },
    feddBack: { type: [commentsSchema] , default:[]},
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
exports.Comments = mongoose.model("Comment", commentsSchema);
