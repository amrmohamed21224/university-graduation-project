const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { registerValidation, loginValidation, updateProfileValidation } = require("./auth.validation");
const validateMiddleware = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");

// Register
router.post("/register", registerValidation, validateMiddleware, authController.register);

// Login
router.post("/login", loginValidation, validateMiddleware, authController.login);

// Get current user
router.get("/me", authMiddleware, authController.getMe);

// Delete account
router.delete("/delete-account", authMiddleware, authController.deleteAccount);

// Update profile
router.put("/update-profile", authMiddleware, updateProfileValidation, validateMiddleware, authController.updateProfile);

module.exports = router;