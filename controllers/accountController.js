const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Login Request
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      req.flash("notice", "You are now logged in.");
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ***************************
 *  Build management view
 * ************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();

  res.render("./account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ********************************
 * Log out process
 * ********************************/
async function accountLogout(req, res) {
  res.clearCookie("jwt");

  // Redirect to home
  res.redirect("/");
}

/* ***************************
 *  Build management view
 * ************************** */
async function buildUpdateView(req, res, next) {
  const account_id = req.params.account_id;
  const data = await accountModel.getAccountByID(account_id);
  let nav = await utilities.getNav();

  res.render("./account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: account_id,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
  });
}


/* ****************************************
 *  Process Update Account
 * *************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  } = req.body;

  const validEmail = await accountModel.checkExistingEmailByID(account_email, account_id);

  if (validEmail > 0) {
    req.flash("notice", "Sorry, that email is already in use.");
    res.redirect("/account/edit/" + account_id);
    return;
  }

  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (regResult) {
    res.clearCookie("jwt")

    let datos = await accountModel.getAccountByID(account_id);

    const accessToken = jwt.sign(datos, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    // can only be passed through http requests, maximum age is 1 hour
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash(
      "notice",
      `Congratulations, you\'re account information was updated.`
    );
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.redirect("/account/edit/" + account_id);
  }
}


/* ****************************************
 *  Update Password
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const {
    account_password,
    account_id,
  } = req.body;

  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.redirect("/account/update/" + account_id);
  }

  const regResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re password was updated.`
    );
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.redirect("/account/edit/" + account_id);
  }
}

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildManagement,
  accountLogout,
  buildUpdateView,
  updateAccount,
  updatePassword,
};
