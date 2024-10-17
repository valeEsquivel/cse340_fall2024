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
router.get("/", utilities.handleErrors(invController.buildManagement));
//Route to add classification page
router.get(
  "/newClassification",
  utilities.handleErrors(invController.buildClassification)
);
//Route to add classification page
router.post(
  "/newClassification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.registerClassification)
);
//Route to add vehicle page
router.get(
  "/newVehicle",
  utilities.handleErrors(invController.buildVehicle)
);
//Route to add inventory page
router.post(
  "/newVehicle",
  invValidate.vehicleRules(),
  invValidate.checkVehicleData,
  utilities.handleErrors(invController.registerVehicle)
);

module.exports = router;
