import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getCategorySummary,
} from "../controllers/transactionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Validation middleware
const validateTransaction = (req, res, next) => {
  const { amount, type, category } = req.body;

  if (!amount || !type || !category) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  next();
};

// Dashboard Routes (IMPORTANT)
router.get("/summary", protect, authorize("admin", "analyst", "viewer"), getSummary);

router.get("/category-summary", protect, authorize("admin", "analyst"), getCategorySummary);

// Create (admin only)
router.post("/", protect, authorize("admin"), validateTransaction, createTransaction);

// Get all (admin + analyst)
router.get("/", protect, authorize("admin", "analyst"), getTransactions);

// Get single
router.get("/:id", protect, authorize("admin", "analyst"), getTransactionById);

// Update (admin only)
router.put("/:id", protect, authorize("admin"), updateTransaction);

// Delete (admin only)
router.delete("/:id", protect, authorize("admin"), deleteTransaction);

// getSummary and getCategorySummary are already defined in transactionController.js and are protected with appropriate roles. No need to redefine them here. 
router.get("/summary", protect, authorize("admin", "analyst", "viewer"), getSummary);
router.get("/category-summary", protect, authorize("admin", "analyst"), getCategorySummary);
export default router;