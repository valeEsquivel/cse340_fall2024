const revModel = require("../models/review-model");
const utilities = require("../utilities/");

const revCont = {};

/* ****************************************
 *  Process Insert Review
 * *************************************** */
revCont.insertReview = async function (req, res, next) {
  const { rev_comment, rev_points, account_id, inv_id } = req.body;

  const regResult = await revModel.insertReview(rev_comment, rev_points, account_id, inv_id);

  if (regResult) {
    req.flash("notice", `Congratulations, review added successfully.`);
    res.status(201).redirect("/inv/detail/" + inv_id);
  } else {
    req.flash("notice", "Sorry, the process failed.");
    res.status(501).redirect("/inv/detail/" + inv_id);
  }
};

module.exports = revCont;
