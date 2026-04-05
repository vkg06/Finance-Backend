import Transaction from "../models/Transaction.js";


// ✅ CREATE TRANSACTION
export const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, note } = req.body;

    // Validation
    if (!amount || !type || !category) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    if (amount <= 0) {
      return res.status(400).json({ msg: "Amount must be positive" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ msg: "Invalid transaction type" });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type,
      category,
      date,
      note,
    });

    res.status(201).json(transaction);

  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// ✅ GET ALL + FILTER + PAGINATION + SORT
export const getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "date",
    } = req.query;

    let filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const total = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .sort({ [sortBy]: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: transactions,
    });

  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// ✅ GET SINGLE TRANSACTION
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(transaction);

  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// ✅ UPDATE TRANSACTION (SAFE UPDATE)
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const allowedFields = ["amount", "type", "category", "date", "note"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        transaction[field] = req.body[field];
      }
    });

    await transaction.save();

    res.json(transaction);

  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// ✅ DELETE TRANSACTION
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({ msg: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// ✅ DASHBOARD SUMMARY (🔥 MUST HAVE)
export const getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const income = await Transaction.aggregate([
      { $match: { user: userId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });

  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


// ✅ CATEGORY-WISE SUMMARY (🔥 BONUS)
export const getCategorySummary = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(data);

  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
};