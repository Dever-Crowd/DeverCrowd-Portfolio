const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const roles = require("../utils/roles");
const pricingController = require("../controller/pricing.controller");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

router.get("/", pricingController.getPublic);

router.get(
  "/manage/all",
  auth.verifyToken,
  auth.allowedTo(roles.ceo, roles.cto),
  pricingController.getAll
);

router.post(
  "/manage",
  auth.verifyToken,
  auth.allowedTo(roles.ceo, roles.cto),
  pricingController.createPlan
);

router.put(
  "/manage/:id",
  auth.verifyToken,
  auth.allowedTo(roles.ceo, roles.cto),
  validatorMiddleware.validateMongoId("id"),
  pricingController.updatePlan
);

router.delete(
  "/manage/:id",
  auth.verifyToken,
  auth.allowedTo(roles.ceo, roles.cto),
  validatorMiddleware.validateMongoId("id"),
  pricingController.deletePlan
);

module.exports = router;
