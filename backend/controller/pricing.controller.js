const Pricing = require("../models/pricing.schema");
const httpResponse = require("../utils/httpResponse");
const errorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middlewares/asyncWrapper");

const getPublic = asyncWrapper(async (req, res) => {
  const plans = await Pricing.find({ isActive: true }).sort({ sortOrder: 1, priceMonthly: 1 }).lean();
  res.json({
    status: httpResponse.status.ok,
    message: "Pricing plans fetched",
    data: { plans },
  });
});

const getAll = asyncWrapper(async (req, res) => {
  const plans = await Pricing.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  res.json({
    status: httpResponse.status.ok,
    message: "All pricing plans",
    data: { plans },
  });
});

const createPlan = asyncWrapper(async (req, res, next) => {
  const body = req.body;
  const exists = await Pricing.findOne({ slug: body.slug });
  if (exists) {
    return next(errorHandler.create("Slug already exists", httpResponse.status.conflict));
  }
  const plan = new Pricing(body);
  await plan.save();
  res.status(201).json({
    status: httpResponse.status.created,
    message: "Plan created",
    data: { plan },
  });
});

const updatePlan = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const plan = await Pricing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!plan) {
    return next(errorHandler.create("Plan not found", httpResponse.status.notfound));
  }
  res.json({
    status: httpResponse.status.ok,
    message: "Plan updated",
    data: { plan },
  });
});

const deletePlan = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const plan = await Pricing.findByIdAndDelete(id);
  if (!plan) {
    return next(errorHandler.create("Plan not found", httpResponse.status.notfound));
  }
  res.json({
    status: httpResponse.status.ok,
    message: "Plan deleted",
    data: null,
  });
});

module.exports = {
  getPublic,
  getAll,
  createPlan,
  updatePlan,
  deletePlan,
};
