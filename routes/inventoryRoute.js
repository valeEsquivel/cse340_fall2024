//Nested Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
// Route to build inventory by classification view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInventoryId)
);
// Route to build inventory by classification view
router.get(
  "/brokenLink",
  utilities.handleErrors(invController.buildBrokenLink)
);
//Route to management page
router.get("/", utilities.checkAccess, utilities.handleErrors(invController.buildManagement));

//Route to add classification page
router.get(
  "/newClassification",
  utilities.checkAccess,
  utilities.handleErrors(invController.buildClassification)
);
//Route to add classification page
router.post(
  "/newClassification",
  utilities.checkAccess,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
);
//Route to add vehicle page
router.get("/newVehicle", utilities.checkAccess, utilities.handleErrors(invController.buildVehicle));

//Route to add inventory page
router.post(
  "/newVehicle",
  utilities.checkAccess,
  invValidate.vehicleRules(),
  invValidate.checkVehicleData,
  utilities.handleErrors(invController.registerVehicle)
);

//Route to get inventory by classification
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

//Route to edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkAccess,
  utilities.handleErrors(invController.buildEditInventory)
);

//Route to update inventory
router.post(
  "/update/",
  utilities.checkAccess,
  invValidate.vehicleRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

//Route to delete inventory view
router.get(
  "/delete/:inv_id",
  utilities.checkAccess,
  utilities.handleErrors(invController.buildDeleteInventory)
);

//Route to delete inventory
router.post(
  "/delete/",
  utilities.checkAccess,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
