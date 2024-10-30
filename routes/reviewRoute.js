//Nested Resources
const express = require("express");
const router = new express.Router();
const revController = require("../controllers/reviewController");
const utilities = require("../utilities/");
const revValidate = require("../utilities/review-validation");

//Route to add review
router.post(
  "/newReview",
  utilities.checkAccess,
  revValidate.reviewRules(),
  revValidate.checkReviewData,
  utilities.handleErrors(revController.insertReview)
);

module.exports = router;
