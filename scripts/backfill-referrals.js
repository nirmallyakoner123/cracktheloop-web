/**
 * Backfill script: populates the new `referrals` collection based on existing users' `referred_by` field.
 * Safe to run multiple times - will not create duplicate referral relationships.
 * Run: node scripts/backfill-referrals.js
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

const PRICE_TO_TIER = {
  "price_1TeCnyEkHwm1l3fZV45CSLvV": "starter",
  "price_1TeCpEEkHwm1l3fZej0zzJhb": "pro",
  "price_1TeCpaEkHwm1l3fZj9f7Gh31": "elite",
};

function normalizeTier(raw) {
  if (!raw) return "free";
  return PRICE_TO_TIER[raw] || raw.toLowerCase();
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  const db = mongoose.connection.db;
  const usersCollection = db.collection("users");
  const referralsCollection = db.collection("referrals");

  // Find all users where referred_by is set (not null, not undefined, and not empty string)
  const referredUsers = await usersCollection
    .find({ referred_by: { $ne: null, $exists: true, $ne: "" } })
    .toArray();

  if (referredUsers.length === 0) {
    console.log("✅ No users found with a referrer. Nothing to backfill.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${referredUsers.length} user(s) who signed up via referral. Processing migration...\n`);

  let count = 0;
  for (const user of referredUsers) {
    // Find the referrer
    const referrer = await usersCollection.findOne({ referral_code: user.referred_by });
    if (!referrer) {
      console.warn(`  ⚠️  Referrer code "${user.referred_by}" not found for user ${user.email}. Skipping.`);
      continue;
    }

    if (referrer._id.toString() === user._id.toString()) {
      console.warn(`  ⚠️  Self-referral detected for user ${user.email}. Skipping.`);
      continue;
    }

    // Check if referral record already exists
    const existing = await referralsCollection.findOne({ referred_user: user._id });
    if (existing) {
      console.log(`  ✓ Referral record already exists for ${user.email}. Skipping.`);
      continue;
    }

    // Determine status and bonuses
    let status = "pending";
    let trial_bonus_paid = false;
    let purchase_bonus_paid = false;
    let referrer_trial_bonus = 0;
    let referred_trial_bonus = 0;
    let referrer_purchase_bonus = 0;
    let referred_purchase_bonus = 0;
    let purchase_tier = null;

    const tier = normalizeTier(user.subscription_tier);

    if (user.is_subscribed || ["starter", "pro", "elite"].includes(tier)) {
      status = "subscribed";
      trial_bonus_paid = true; // Assume trial was activated or skipped prior to subscription
      purchase_bonus_paid = true;
      referrer_trial_bonus = 8;
      referred_trial_bonus = 3;
      purchase_tier = tier;

      if (tier === "starter") {
        referrer_purchase_bonus = 50;
        referred_purchase_bonus = 20;
      } else if (tier === "pro") {
        referrer_purchase_bonus = 150;
        referred_purchase_bonus = 60;
      } else if (tier === "elite") {
        referrer_purchase_bonus = 500;
        referred_purchase_bonus = 200;
      }
    } else if (tier === "trial") {
      status = "trial_activated";
      trial_bonus_paid = true;
      referrer_trial_bonus = 8;
      referred_trial_bonus = 3;
    }

    await referralsCollection.insertOne({
      referrer: referrer._id,
      referred_user: user._id,
      referral_code: user.referred_by,
      status: status,
      trial_bonus_paid: trial_bonus_paid,
      purchase_bonus_paid: purchase_bonus_paid,
      referrer_trial_bonus: referrer_trial_bonus,
      referred_trial_bonus: referred_trial_bonus,
      referrer_purchase_bonus: referrer_purchase_bonus,
      referred_purchase_bonus: referred_purchase_bonus,
      purchase_tier: purchase_tier,
      created_at: user.created_at || new Date(),
      updated_at: user.updated_at || new Date(),
    });

    console.log(`  ✓ Migrated: ${referrer.email} -> ${user.email} (Status: ${status}, Bonuses Earned: ${referrer_trial_bonus + referrer_purchase_bonus} credits)`);
    count++;
  }

  console.log(`\n✅ Done. Migrated ${count} referral record(s) into the referrals collection.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
