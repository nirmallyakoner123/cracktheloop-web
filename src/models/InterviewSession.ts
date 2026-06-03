import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITranscriptTurn {
  sender: "interviewer" | "candidate" | "copilot";
  text: string;
  timestamp: Date;
}

export interface IEvaluationReport {
  communication_score: number;
  technical_score: number;
  overall_score: number;
  feedback: string;
  improvement_guide: string;
}

export interface IInterviewSession extends Document {
  user_id: mongoose.Types.ObjectId;
  role: string;
  company?: string;
  transcript: ITranscriptTurn[];
  report?: IEvaluationReport;
  created_at: Date;
  updated_at: Date;
}

const TranscriptTurnSchema = new Schema<ITranscriptTurn>(
  {
    sender: {
      type: String,
      enum: ["interviewer", "candidate", "copilot"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const EvaluationReportSchema = new Schema<IEvaluationReport>(
  {
    communication_score: {
      type: Number,
      default: 0,
    },
    technical_score: {
      type: Number,
      default: 0,
    },
    overall_score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    improvement_guide: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      default: null,
      trim: true,
    },
    transcript: {
      type: [TranscriptTurnSchema],
      default: [],
    },
    report: {
      type: EvaluationReportSchema,
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

export const InterviewSession: Model<IInterviewSession> =
  mongoose.models.InterviewSession ||
  mongoose.model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
