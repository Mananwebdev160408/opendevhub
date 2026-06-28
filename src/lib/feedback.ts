import mongoose, { Schema } from "mongoose"

const FeedbackSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: "No Subject" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

export const Feedback = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema)
