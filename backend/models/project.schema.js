const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    required: true,
  },
  timeToFinish: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "in progress", "review", "completed"],
    default: "pending",
  },
  cost: {
    type: Number,
    required: true,
    default: 0,
  },
  timeSpend: {
    type: String,
    required: true,
    default: "0",
  },
  category: {
    type: String,
    required: true,
  },
  scope: [
    {
      type: String,
      required: true,
    },
  ],
  stack: [
    {
      type: String,
      required: true,
    },
  ],
  industry: [
    {
      type: String,
      required: true,
    },
  ],
  live: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  },
}, { timestamps: true }); // إضافة timestamps لمتابعة الإنشاء والتعديل

module.exports = mongoose.model("Project", projectSchema, "projects");