const utilities = require(".");
const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model");
const validate = {};

/* ***********************
 * Classification Data Validation Rules
 *************************/
validate.classificationRules = () => {
  return [
    //classification_name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a classification name."),
  ];
};

/* ***********************
 * Check data an return errors or continue to classification
 *************************/
validate.checkClassificationData = async (req, res, next) => {
  const {
    classification_name
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/newClassification", {
      errors,
      title: "New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* ***********************
 * Vehicle Data Validation Rules
 *************************/
validate.vehicleRules = () => {
  return [
    //inv_make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a make."),

    //inv_model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a model."),

    //inv_year is required and must be string
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a year."),

    //inv_description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a description."),

    //inv_image is required and must be string
    // body("inv_image")
    //   .trim()
    //   .escape()
    //   .notEmpty()
    //   .isURL()
    //   .withMessage("Please provide a valid image URL."),

    // //inv_thumbnail is required and must be string
    // body("inv_thumbnail")
    //   .trim()
    //   .escape()
    //   .notEmpty()
    //   .isURL()
    //   .withMessage("Please provide a valid thumbnail URL."),

    //inv_price is required and must be number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a price."),

    //inv_miles is required and must be integer
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide miles."),

    //inv_color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a color."),

    //classification_id is required and must be integer
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Please provide a classification.")
      .custom(async (classification_id) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_id);
        if (!classificationExists) {
          throw new Error("Classification does not exist.");
        }
      }),
  ];
};

/* ***********************
 * Check data an return errors or continue to vehicle
 *************************/
validate.checkVehicleData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classifications_select = await utilities.buildClassificationList(null);
    res.render("./inventory/newVehicle", {
      errors,
      title: "New Vehicle",
      nav,
      classifications_select,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};


/* ***********************
 * Check data an return errors or continue to edit the inventory
 *************************/
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classifications_select = await utilities.buildClassificationList(null);
    const itemName = `${inv_make} ${inv_model}`;

    res.render("./inventory/editInventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classifications_select,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
    return;
  }
  next();
};

module.exports = validate;