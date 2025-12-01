const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/auth/register - Register user baru
router.post("/register", authController.register);

// POST /api/auth/login - Login user
router.post("/login", authController.login);

// GET /api/auth/profile - Get user profile (protected)
router.get("/profile", verifyToken, authController.getProfile);

// PUT /api/auth/profile - Update user profile (protected)
router.put("/profile", verifyToken, authController.updateProfile);

module.exports = router;
