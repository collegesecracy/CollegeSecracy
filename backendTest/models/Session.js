import mongoose from "mongoose";

// creating the session schema
const SessionSchema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
    title: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String },
    endTime: { type: String },
    duration: { type: String },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
   bookmarked: { type: Boolean, default: false },
   notes:{type: String},
   completionDate: { type: Date, required: false },
status: {
  type: String,
  enum: ["planned", "in-progress", "postponed", "completed"],
  default: "planned",
},

    topics:{type:String},
  },
  { timestamps: true }
);

// exporting the session Schema

export default mongoose.model("Session", SessionSchema);