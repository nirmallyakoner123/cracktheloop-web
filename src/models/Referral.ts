import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferral extends Document {
  referrer: mongoose.Types.ObjectId;
  referred_user: mongoose.Types.ObjectId;
  referral_code: string;
  status: "pending" | "trial_activated" | "subscribed";
  trial_bonus_paid: boolean;
  purchase_bonus_paid: boolean;
  referrer_trial_bonus: number;
  referred_trial_bonus: number;
  referrer_purchase_bonus: number;
  referred_purchase_bonus: number;
  purchase_tier?: string;
  created_at: Date;
  updated_at: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    referred_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    referral_code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "trial_activated", "subscribed"],
      default: "pending",
    },
    trial_bonus_paid: {
      type: Boolean,
      default: false,
    },
    purchase_bonus_paid: {
      type: Boolean,
      default: false,
    },
    referrer_trial_bonus: {
      type: Number,
      default: 0,
    },
    referred_trial_bonus: {
      type: Number,
      default: 0,
    },
    referrer_purchase_bonus: {
      type: Number,
      default: 0,
    },
    referred_purchase_bonus: {
      type: Number,
      default: 0,
    },
    purchase_tier: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

// Always delete and re-register the model so HMR / schema changes are always picked up.
// Safe in production because Node.js module cache means this file runs once per process.
if (mongoose.models["Referral"]) {
  delete (mongoose.models as any)["Referral"];
}

export const Referral: Model<IReferral> = mongoose.model<IReferral>("Referral", ReferralSchema);
