import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITokenUsage extends Document {
  user_id: mongoose.Types.ObjectId;
  session_id: string;
  model_name: string;
  input_tokens: number;
  output_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost: number;
  request_type: string;
  metadata?: any;
  created_at: Date;
}

const TokenUsageSchema = new Schema<ITokenUsage>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    session_id: {
      type: String,
      required: true,
      index: true,
    },
    model_name: {
      type: String,
      required: true,
    },
    input_tokens: {
      type: Number,
      required: true,
      default: 0,
    },
    output_tokens: {
      type: Number,
      required: true,
      default: 0,
    },
    prompt_tokens: {
      type: Number,
      required: true,
      default: 0,
    },
    completion_tokens: {
      type: Number,
      required: true,
      default: 0,
    },
    total_tokens: {
      type: Number,
      required: true,
      default: 0,
    },
    cost: {
      type: Number,
      required: true,
      default: 0,
    },
    request_type: {
      type: String,
      required: true,
      default: "normal",
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
    versionKey: false,
  }
);

if (mongoose.models.TokenUsage) {
  delete (mongoose.models as any).TokenUsage;
}

export const TokenUsage: Model<ITokenUsage> =
  mongoose.models.TokenUsage ||
  mongoose.model<ITokenUsage>("TokenUsage", TokenUsageSchema);
