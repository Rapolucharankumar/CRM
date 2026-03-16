import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a lead name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    source: {
      type: String,
      enum: ["Website", "Phone", "Email", "Referral", "Social Media", "Other"],
      default: "Website",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed", "Lost"],
      default: "New",
    },
    notes: {
      type: String,
      default: "",
    },
    dealValue: {
      type: Number,
      default: 0,
    },
    nextFollowUp: {
      type: Date,
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ email: 1 });

export default mongoose.model("Lead", leadSchema);
