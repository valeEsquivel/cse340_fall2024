const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const revModel = require("../models/review-model");
const validate = {};

/* ***********************
 * Vehicle Data Validation Rules
 *************************/
validate.reviewRules = () => {
  return [
    //rev_comment is required and must be string
    body("rev_comment")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a review."),

    //rev_points is required and must be integer
    body("rev_points")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      //min 1 max 5
      .isInt({ min: 1, max: 5 })
      .withMessage("Please give a score within the established range 1 - 5 (integer number)"),
  ];
};

/* ***********************
 * Check data an return errors or continue to review
 *************************/
validate.checkReviewData = async (req, res, next) => {
  const { rev_comment, rev_points, account_id, inv_id } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    const data = await invModel.getSingleInventory(inv_id);
    const grid = await utilities.buildDetailGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].inv_make + " " + data[0].inv_model;

    const reviews = await revModel.getReviewsByInvId(inv_id);
    const rating = await revModel.getAverageRating(inv_id);

    let reviewPanel = await utilities.buildReviews(reviews, rating);

    res.render("./inventory/details", {
      title: className,
      nav,
      grid,
      errors,
      reviewPanel,
      rev_comment,
      rev_points,
      account_id,
      inv_id,
    });
    return;
  }
  next();
};

module.exports = validate;
