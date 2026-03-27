const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();        // ← This must come first
const PORT = process.env.PORT || 3000;

// Connection settings for local development
const mongoUser = process.env.MONGO_USERNAME || "admin";
const mongoPass = process.env.MONGO_PASSWORD;
const mongoHost = "localhost";
const dbName = "testdb";

const uri = `mongodb://${mongoUser}:${encodeURIComponent(mongoPass)}@${mongoHost}:27017/?authSource=admin`;

let db;

console.log("🔍 Trying to connect with user:", mongoUser);

async function connectDB() {
  try {
    const client = new MongoClient(uri, { 
      serverSelectionTimeoutMS: 15000 
    });
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    if (err.message.includes("Authentication failed")) {
      console.error("   → Username or Password is incorrect. Check your .env file");
    }
  }
}

connectDB();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🚀 2-Tier App Running with MongoDB");
});

app.get("/data", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database not connected yet. Please wait..." });
    }
    const collection = db.collection("items");
    await collection.insertOne({ name: "Saima App", time: new Date() });
    const data = await collection.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});