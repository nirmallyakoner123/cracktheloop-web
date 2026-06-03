/**
 * One-time migration: converts raw Stripe price IDs stored in `subscription_tier`
 * to human-readable names ('starter', 'pro', 'elite').
 * Run: node scripts/migrate-tiers.js
 */

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const PRICE_TO_TIER = {
  "price_1TeCnyEkHwm1l3fZV45CSLvV": "starter",
  "price_1TeCpEEkHwm1l3fZej0zzJhb": "pro",
  "price_1TeCpaEkHwm1l3fZj9f7Gh31": "elite",
};

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;
  const users = db.collection("users");

  let fixedCount = 0;

  for (const [priceId, tierName] of Object.entries(PRICE_TO_TIER)) {
    const result = await users.updateMany(
      { subscription_tier: priceId },
      { $set: { subscription_tier: tierName, updated_at: new Date() } }
    );
    if (result.modifiedCount > 0) {
      console.log(`  → Migrated ${result.modifiedCount} user(s): ${priceId} → "${tierName}"`);
      fixedCount += result.modifiedCount;
    }
  }

  if (fixedCount === 0) {
    console.log("ℹ️  No records needed migration (all tiers are already human-readable).");
  } else {
    console.log(`\n✅ Migration complete. Fixed ${fixedCount} record(s).`);
  }

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
