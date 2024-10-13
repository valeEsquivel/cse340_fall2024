//Nested Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route the registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
