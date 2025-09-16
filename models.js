import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  total_spend: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  last_order_date: Date,
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

// ✅ Campaign Schema
const CampaignSchema = new mongoose.Schema(
  {
    rules: { type: Array, required: true }, 
    audience_size: { type: Number, required: true },
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const CommunicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  message: String,
  status: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
  createdAt: { type: Date, default: Date.now },
});

export const Customer = mongoose.model("Customer", CustomerSchema);
export const Order = mongoose.model("Order", OrderSchema);
export const Campaign = mongoose.model("Campaign", CampaignSchema);
export const CommunicationLog = mongoose.model("CommunicationLog", CommunicationLogSchema);