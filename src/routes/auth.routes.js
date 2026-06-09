const express = require("express");

const router = express.Router();

const {
  register,
  login
} = require("../controllers/auth.controller");

/**
 * Register User
 * POST /api/auth/register
 */
router.post(
  "/register",
  register
);

/**
 * Login User
 * POST /api/auth/login
 */
router.post(
  "/login",
  login
);

module.exports = router;