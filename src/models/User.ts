import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  referral_code?: string;
  referred_by?: string;
  is_subscribed: boolean;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_tier: string;
  credits: number;
  otp_code?: string;
  otp_expiry?: Date;
  trial_expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: null,
    },
    referral_code: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    referred_by: {
      type: String,
      default: null,
    },
    is_subscribed: {
      type: Boolean,
      default: false,
    },
    stripe_customer_id: {
      type: String,
      default: null,
    },
    stripe_subscription_id: {
      type: String,
      default: null,
    },
    subscription_tier: {
      type: String,
      default: "free",
    },
    credits: {
      type: Number,
      default: 0,
    },
    otp_code: {
      type: String,
      default: null,
    },
    otp_expiry: {
      type: Date,
      default: null,
    },
    trial_expires_at: {
      type: Date,
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
// Without this, `mongoose.models.User || mongoose.model(...)` returns a stale schema
// that silently drops fields like referral_code when hydrating documents.
if (mongoose.models["User"]) {
  delete (mongoose.models as any)["User"];
}
export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
