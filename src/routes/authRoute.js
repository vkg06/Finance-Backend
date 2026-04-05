import express from "express";
import { register, login } from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// 🔥 Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, try again later",
});

// ✅ Register validation
const validateRegister = (req, res, next) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  name = name.trim();
  email = email.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  req.body.name = name;
  req.body.email = email;

  next();
};

// ✅ Login validation
const validateLogin = (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  email = email.trim();
  req.body.email = email;

  next();
};

// Routes
router.post("/register", validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);

export default router;