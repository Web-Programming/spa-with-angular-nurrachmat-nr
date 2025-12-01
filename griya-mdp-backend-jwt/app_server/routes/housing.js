const express = require("express");
const router = express.Router();
const housingController = require("../controllers/housingcontroller");
const { verifyToken } = require("../middleware/authMiddleware");

// Get my housing (Protected - requires JWT)
router.get("/my", verifyToken, housingController.GetMyHousing);

// Get all housing (with optional type filter via query parameter)
router.get("/", housingController.Index);

// Get housing by ID
router.get("/:id", housingController.GetById);

// Create new housing (Protected - requires JWT)
router.post("/", verifyToken, housingController.Create);

// Update housing (Protected - requires JWT)
router.put("/:id", verifyToken, housingController.Update);

// Delete housing (Protected - requires JWT)
router.delete("/:id", verifyToken, housingController.Delete);

module.exports = router;