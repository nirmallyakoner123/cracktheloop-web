import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlan extends Document {
  name: string;
  price_id: string; // Stripe Price ID
  price: number; // in USD
  interval: string; // "month" or "year"
  credits: number; // credits provided per cycle (minutes or tokens)
  features: string[];
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    interval: {
      type: String,
      default: "month",
    },
    credits: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
    },
    is_active: {
      type: Boolean,
      default: true,
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

export const Plan: Model<IPlan> =
  mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);
