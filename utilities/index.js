const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = "<ul id='menu'>";
  list += "<li><a href='/' title='Home Page'>Home</a></li>";
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li class='card-vehicle'>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View "' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt ="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span class='price-vehicle'>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};

/* **************************************
 * Build the Detail Inventory view HTML
 * ************************************ */
Util.buildDetailGrid = async function (data) {
  let grid;
  if (data) {
    grid = `
    <div class="detail-vehicle">
      <section class="details-image">
        <img src="${data[0].inv_image}" alt="Image of ${data[0].inv_make} ${
      data[0].inv_model
    } on CSE Motors" />
      </section>
      <section class="details-info">
        <p class="price-details">Price: $${new Intl.NumberFormat(
          "en-US"
        ).format(data[0].inv_price)}</p>
        <p><strong>Year:</strong> ${data[0].inv_year}</p>
        <p><strong>Description:</strong> ${data[0].inv_description}</p>
        <p><strong>Color:</strong> ${data[0].inv_color}</p>
        <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(
          data[0].inv_miles
        )}</p>
        <p><strong>Classification:</strong> ${data[0].classification_name}</p>
      </section>
    </div>  
    `;
  }

  return grid;
};

/* **************************************
 * Build the List for the Classifications
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classification_id" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
* Check Client Type, not allowed for inv/ routes
* ************************************ */
Util.checkAccess = (req, res, next) => {
  // auth : 0
  let auth = 0
  // logged in ? next : 0
  if (res.locals.loggedin) {
    const account = res.locals.accountData
    // admin ? 1 : 0
    account.account_type == "Admin" 
      || account.account_type == "Employee" ? auth = 1 : auth = 0 
  }
  // !auth ? 404 : next()
  if (!auth) {
    req.flash("notice", "Please log in")
    res.redirect("/account/login")
    return
  } else {
    next()
  }
};

/* ****************************************
  *  Build reviews HTML
  * ************************************ */
Util.buildReviews = async function (data, rating) {
  let rate = +rating[0].avg;

  if (rate == null) {
    rate = 0;
  }

  rate = rate.toFixed(2);

  let reviews = "";
  reviews += "<h3>** Reviews **</h3>";
  reviews += "<p id='ratingReview'>Average Rating: " + rate + "</p>";
  reviews += "<ul id='reviews'>";
  data.forEach((review) => {
    reviews += "<li>";
    reviews += "<p><b>Posted By:</b> " + review.account_firstname + " " + review.account_lastname + "</p>";
    reviews += "<p> ~" + review.rev_comment + "</p>";
    reviews += "<p><b>Rating:</b> " + review.rev_points + "</p>";
    reviews += "</li>";
  });
  reviews += "</ul>";
  return reviews;
}

module.exports = Util;
