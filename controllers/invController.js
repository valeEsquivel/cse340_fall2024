const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const classification_info = await invModel.getSingleClassification(
    classification_id
  );
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = classification_info[0].classification_name;

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build inventory details by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getSingleInventory(inv_id);
  const grid = await utilities.buildDetailGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].inv_make + " " + data[0].inv_model;

  res.render("./inventory/details", {
    title: className,
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();

  const classificationSelect = await utilities.buildClassificationList(null);

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null,
  });
};

/* ***************************
 *  Build new classification view
 * ************************** */
invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("./inventory/newClassification", {
    title: "New Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Insert Classification
 * *************************************** */
invCont.registerClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const regResult = await invModel.registerClassification(classification_name);

  let nav = await utilities.getNav();

  if (regResult) {
    const classificationSelect = await utilities.buildClassificationList(null);

    req.flash("notice", `Congratulations, classification added successfully.`);
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("./inventory/newClassification", {
      title: "New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Build new vehicle view
 * ************************** */
invCont.buildVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classifications_select = await utilities.buildClassificationList(null);

  res.render("./inventory/newVehicle", {
    title: "New Vehicle",
    nav,
    classifications_select,
    errors: null,
  });
};

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
    req.flash("notice", `Congratulations, vehicle added successfully.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).render("./inventory/newVehicle", {
      title: "New Vehicle",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build Edit Inventory view
 * ************************** */
invCont.buildEditInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const invData = await invModel.getSingleInventory(inv_id);
  const classifications = await utilities.buildClassificationList(
    invData[0].classification_id
  );
  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`;

  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classifications_select: classifications,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_description: invData[0].inv_description,
    inv_image: invData[0].inv_image,
    inv_thumbnail: invData[0].inv_thumbnail,
    inv_price: invData[0].inv_price,
    inv_miles: invData[0].inv_miles,
    inv_color: invData[0].inv_color,
    classification_id: invData[0].classification_id,
  });
};

/* ****************************************
 *  Process Update Vehicle
 * *************************************** */
invCont.updateInventory = async function (req, res, next) {
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

  let nav = await utilities.getNav();

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      classifications_select: classificationSelect,
      errors: null,
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
  }
};

/* ***************************
 *  Build Delete Inventory view
 * ************************** */
invCont.buildDeleteInventory = async (req, res, next) => {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const invData = await invModel.getSingleInventory(inv_id);
  const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`;

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_price: invData[0].inv_price,
  });
};

/* ****************************************
 *  Process Delete Vehicle
 * *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);

  let nav = await utilities.getNav();

  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    const invData = await invModel.getSingleInventory(inv_id);
    const itemName = `${invData[0].inv_make} ${invData[0].inv_model}`;

    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: invData[0].inv_id,
      inv_make: invData[0].inv_make,
      inv_model: invData[0].inv_model,
      inv_year: invData[0].inv_year,
      inv_price: invData[0].inv_price,
    });
  }
};

module.exports = invCont;
