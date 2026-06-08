/**
 * Backfill script: assigns a unique referral_code to every user that doesn't have one.
 * Safe to run multiple times - only touches users with null/missing referral_code.
 * Run: node scripts/backfill-referral-codes.js
 */

const fs = require("fs");
const path = require("path");

// Load .env.local if present
try {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.warn("Failed to load .env.local", e);
}

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI env var is required.");
  process.exit(1);
}

function generateCode() {
  return "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function getUniqueCode(collection) {
  let code = "";
  let unique = false;
  while (!unique) {
    code = generateCode();
    const exists = await collection.findOne({ referral_code: code });
    if (!exists) unique = true;
  }
  return code;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  const users = mongoose.connection.db.collection("users");

  // Find all users without a referral_code (null, undefined, or missing field)
  const usersWithoutCode = await users
    .find({ $or: [{ referral_code: null }, { referral_code: { $exists: false } }] })
    .toArray();

  if (usersWithoutCode.length === 0) {
    console.log("✅ All users already have a referral code. Nothing to do.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${usersWithoutCode.length} user(s) without a referral code. Assigning...\n`);

  let count = 0;
  for (const user of usersWithoutCode) {
    const code = await getUniqueCode(users);
    await users.updateOne(
      { _id: user._id },
      { $set: { referral_code: code, updated_at: new Date() } }
    );
    console.log(`  ✓ ${user.email.padEnd(35)} → ${code}`);
    count++;
  }

  console.log(`\n✅ Done. Assigned referral codes to ${count} user(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
