const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

// ENV variables
const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPass = process.env.MONGO_INITDB_ROOT_PASSWORD;
const mongoHost = process.env.MONGO_HOST || "mongodb";
const dbName = "testdb";

const uri = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:27017`;

let db;

async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB ✅");
  } catch (err) {
    console.error("DB connection failed ❌", err);
  }
}

connectDB();

// Routes
app.get("/", async (req, res) => {
  res.send("🚀 2-Tier App Running with MongoDB");
});

app.get("/data", async (req, res) => {
  const collection = db.collection("items");
  await collection.insertOne({ name: "Saima App", time: new Date() });

  const data = await collection.find().toArray();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});