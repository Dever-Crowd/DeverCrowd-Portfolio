const messageController = require("../controllers/message.controller");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const validator = require("../utils/validator");
const validateInputs = require("../middlewares/validateInputs");
const rateLimit = require("../middlewares/rateLimit");

router
  .route("/")
  .post(
    rateLimit.formRateLimiter,
    validator.messageValidtor(),
    validateInputs,
    messageController.sendForm
  );

module.exports = router;
