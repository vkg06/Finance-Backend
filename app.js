import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoute.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/summary", transactionRoutes);
// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

export default app;