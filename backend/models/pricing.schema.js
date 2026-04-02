const mongoose = require("mongoose");

const pricingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    priceMonthly: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD", trim: true },
    features: [{ type: String, trim: true }],
    highlighted: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pricing", pricingSchema);
