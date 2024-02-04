const { signup, login, logout, resetPassword, verifyOtp, getUser } = require("./controllers/AuthController");
const { addToCart, getCart, removeFromCart, incrementQuantity, decrementQuantity, checkout, clearCart } = require("./controllers/FeatureController");
const { verifyToken } = require("./middlewares/verifyToken");

const router = require("express").Router();

// AUTH ROUTES
router.post("/signup", signup)
router.post("/login",login)
router.get("/logout", logout)
router.put("/reset-password", resetPassword)
router.put("/verify-otp", verifyOtp)
router.get("/get-user",verifyToken,getUser)

// FEATURE ROUTES
router.post("/add-to-cart/:id", addToCart)
router.get("/get-cart/:id", getCart)
router.delete("/remove-from-cart/:id", removeFromCart)
router.put("/increment-quantity/:id", incrementQuantity)
router.put("/decrement-quantity/:id", decrementQuantity)
router.get("/checkout",verifyToken, checkout)
router.get("/clear-cart",verifyToken,clearCart)

module.exports = router;
