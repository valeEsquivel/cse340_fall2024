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

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

//Route to management page
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

//Logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route to build inventory by classification view
router.get(
  "/edit/:account_id",
  utilities.handleErrors(accountController.buildUpdateView)
);

//Route to update inventory
router.post(
  "/edit/",
  regValidate.registrationUpdRules(),
  regValidate.checkRegUpdData,
  utilities.handleErrors(accountController.updateAccount)
);

//Route to update password
router.post(
  "/updatePassword/",
  regValidate.registrationUpdPass(),
  regValidate.checkRegUpdData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
