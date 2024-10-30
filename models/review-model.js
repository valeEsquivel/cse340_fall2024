const pool = require("../database/");

/* ***************************
 *  Get all reviews from a specific inventory item
 * ************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT r.*, a.account_firstname, a.account_lastname FROM public.review AS r
        INNER JOIN public.account AS a ON r.account_id = a.account_id
        WHERE r.inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.log("Error in getReviewsByInvId", error);
  }
}

/* ***************************
 *  Insert a new review for a specific inventory item
 * ************************** */
async function insertReview(rev_comment, rev_points, account_id, inv_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.review (rev_comment, rev_points, account_id, inv_id)
        VALUES ($1, $2, $3, $4)`,
      [rev_comment, rev_points, account_id, inv_id]
    );
    return data.rows;
  } catch (error) {
    console.log("Error in insertReview", error);
  }
}

/* ***************************
 *  Get the average rating for a specific inventory item
 * ************************** */
async function getAverageRating(inv_id) {
  try {
    const data = await pool.query(
      `SELECT AVG(rev_points) FROM public.review WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.log("Error in getAverageRating", error);
  }
}

module.exports = {
  getReviewsByInvId,
  insertReview,
  getAverageRating,
};
