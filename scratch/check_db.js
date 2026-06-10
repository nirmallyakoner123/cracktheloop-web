const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/^MONGODB_URI=["']?([^"'\r\n]+)/m);

if (!match) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

const MONGODB_URI = match[1];

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  
  const plans = await db.collection("plans").find({}).toArray();
  console.log("=== PLANS ===");
  console.log(JSON.stringify(plans, null, 2));

  const settings = await db.collection("referralsettings").find({}).toArray();
  console.log("=== REFERRAL SETTINGS ===");
  console.log(JSON.stringify(settings, null, 2));

  await mongoose.disconnect();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
