const Food = require("../models/Food");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_KEY);

// ADD TO CART ROUTE
const addToCart = async (req, res) => {
  const userId = req.params.id;
  const { id, name, price, rating, image, quantity } = req.body;

  try {
    let existingItem = await Food.findOne({ id, userId: userId });

    if (existingItem) {
      let updatedItem = await Food.findOneAndUpdate(
        { id, userId },
        {
          $set: {
            quantity: existingItem.quantity + 1,
            totalPrice: existingItem.price * (existingItem.quantity + 1),
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      if (!updatedItem) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to add to cart" });
      }

      return res.status(200).json({ success: true, message: "Added to cart" });
    }

    let newFood = await Food.create({
      id,
      name,
      price,
      rating,
      image,
      quantity,
      userId,
      totalPrice: price * quantity,
    });

    const savedFood = await newFood.save();

    let user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          cartItems: savedFood._id,
        },
      }
    );

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to add to cart" });
    }

    return res.status(200).json({ success: true, message: "Added to cart" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET CART ITEMS ROUTE
const getCart = async (req, res) => {
  const userId = req.params.id;

  try {
    const cartItems = await Food.find({ userId });

    if (!cartItems) {
      return res
        .status(400)
        .json({ success: false, message: "No items found" });
    }

    return res.status(200).json({ success: true, cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// REMOVE FROM CART ROUTE
const removeFromCart = async (req, res) => {
  const id = req.params.id;

  try {
    let food = await Food.findOneAndDelete({ _id: id });

    if (!food) {
      return res
        .status(400)
        .json({ success: false, message: "Food not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Food Removed from cart" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// INCREMENT QUANTITY ROUTE
const incrementQuantity = async (req, res) => {
  const id = req.params.id;

  try {
    let food = await Food.findOneAndUpdate(
      { _id: id },
      [
        {
          $set: {
            quantity: { $add: ["$quantity", 1] },
            totalPrice: { $multiply: ["$price", { $add: ["$quantity", 1] }] },
          },
        },
      ],
      {
        upsert: true,
        new: true,
      }
    );

    if (!food) {
      return res
        .status(400)
        .json({ success: false, message: "Food not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Food quantity incremented", food });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DECREMENT QUANTITY ROUTE
const decrementQuantity = async (req, res) => {
  const id = req.params.id;

  try {
    let food = await Food.findOneAndUpdate(
      { _id: id, quantity: { $gt: 0 } },
     [ {
        $set: {
          quantity: { $subtract: ["$quantity", 1] },
          totalPrice: { $subtract: ["$totalPrice", "$price"] },
        },
      }],
      {
        upsert: true,
        new: true,
      }
    );

    if (!food) {
      return res.status(400).json({
        success: false,
        message: "Food not found or quantity already at the maximum",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "Food quantity decremented", food });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CHECKOUT ROUTE
const checkout = async (req, res) => {
  const userId = req.id;

  try {
    const cartItems = await Food.find({ userId });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price * 100,
          },

          quantity: item.quantity,
        };
      }),
      success_url: "https://flavoro-clone.vercel.app/success",
      cancel_url: "https://flavoro-clone.vercel.app/",
    });

    res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CLEAR CART ROUTE
const clearCart = async (req, res) => {
  const userId = req.id;

  try {
    const deletedItems = await Food.deleteMany({ userId });
    const deletedList = await User.findOneAndUpdate(
      { _id: userId },
      {
        cartItems: [],
      }
    );

    if (!deletedItems) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to clear cart" });
    }

    return res.status(200).json({ success: true, message: "Order Confirmed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  checkout,
  clearCart,
};
