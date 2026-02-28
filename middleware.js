const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path,"..",req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to make order/review");
    return res.redirect("/login");
  }
  next();
};
module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) return next();
  res.send("Access Denied");
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, revId } = req.params;
  const review = await Review.findById(revId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/products/${id}`);
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
