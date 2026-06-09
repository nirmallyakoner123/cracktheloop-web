import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReferralSetting extends Document {
  trial_base_credits: number;
  trial_referred_bonus: number;
  trial_referrer_bonus: number;
  trial_expiry_days: number; // <= 0 or -1 means no expiration
  trial_expiration_days?: number; // fallback field
  purchase_referred_multiplier: number; // e.g. 1.2 for +20%
  purchase_referrer_ratio: number;       // e.g. 0.5 for +50%
  created_at: Date;
  updated_at: Date;
}

const ReferralSettingSchema = new Schema<IReferralSetting>(
  {
    trial_base_credits: {
      type: Number,
      default: 50,
    },
    trial_referred_bonus: {
      type: Number,
      default: 0,
    },
    trial_referrer_bonus: {
      type: Number,
      default: 50,
    },
    trial_expiry_days: {
      type: Number,
      default: -1, // No expiration by default as requested
    },
    trial_expiration_days: {
      type: Number,
      default: 0,
    },
    purchase_referred_multiplier: {
      type: Number,
      default: 1.2,
    },
    purchase_referrer_ratio: {
      type: Number,
      default: 0.5,
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

if (mongoose.models["ReferralSetting"]) {
  delete (mongoose.models as any)["ReferralSetting"];
}

export const ReferralSetting: Model<IReferralSetting> = mongoose.model<IReferralSetting>(
  "ReferralSetting",
  ReferralSettingSchema
);
