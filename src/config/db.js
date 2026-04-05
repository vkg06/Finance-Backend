import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`❌ Mongoose error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Mongoose disconnected. Trying to reconnect...");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed");
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log("💥 Server stopped due to DB failure");
    process.exit(1);
  }
};

export default connectDB;