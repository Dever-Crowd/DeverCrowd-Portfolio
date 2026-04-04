const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    originalPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    realPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    currency: { type: String, default: "USD", trim: true },
    features: [{ type: String, trim: true }],
    highlighted: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly", "one-time"],
      default: "monthly",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Pricing", pricingSchema);
