const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    price: Number,
    totalPrice: Number,
    quantity: Number,
    rating: Number,
    image: String,
    userId: String,
  },
  { timestamps: true }
);

const Food = mongoose.model("food", foodSchema);
module.exports = Food;
