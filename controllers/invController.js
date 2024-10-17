const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const classification_info = await invModel.getSingleClassification(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = classification_info[0].classification_name

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory details by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getSingleInventory(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_make + " " + data[0].inv_model

  res.render("./inventory/details", {
    title: className,
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build new classification view
 * ************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav()

  res.render("./inventory/newClassification", {
    title: "New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Insert Classification
 * *************************************** */
invCont.registerClassification = async function (req, res, next) {
  const {
    classification_name,
  } = req.body;
  
  const regResult = await invModel.registerClassification(
    classification_name
  );

  let nav = await utilities.getNav();

  if (regResult) {
    debugger;
    req.flash(
      "notice",
      `Congratulations, classification added successfully.`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("./inventory/newClassification", {
      title: "New Classification",
      nav,
      errors: null,
    });
  }
}

/* ***************************
 *  Build new vehicle view
 * ************************** */
invCont.buildVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classifications_select = await utilities.buildClassificationList(null)

  res.render("./inventory/newVehicle", {
    title: "New Vehicle",
    nav,
    classifications_select,
    errors: null,
  })  
}

/* ****************************************
 *  Process Insert Vehicle
 * *************************************** */
invCont.registerVehicle = async function (req, res, next) {
  const {
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

  const regResult = await invModel.registerVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  let nav = await utilities.getNav();

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, vehicle added successfully.`
    );
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("./inventory/newVehicle", {
      title: "New Vehicle",
      nav,
      errors: null,
    });
  }
}

module.exports = invCont