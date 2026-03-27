const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

const mongoUser = process.env.MONGO_USERNAME || process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPass = process.env.MONGO_PASSWORD || process.env.MONGO_INITDB_ROOT_PASSWORD;
const mongoHost = process.env.MONGO_HOST || "mongodb";
const dbName = "testdb";

const uri = `mongodb://${mongoUser}:${encodeURIComponent(mongoPass)}@${mongoHost}:27017/?authSource=admin`;

let db;

async function connectDB() {
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
    });
    
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    // Do not exit in development, but show clear error
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
      return res.status(500).json({ error: "Database not connected yet" });
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