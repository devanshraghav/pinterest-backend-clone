var express = require("express");
var router = express.Router();

const userModel = require("./users");
const postModel = require("./posts");

const passport = require("passport");
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("feed");
});

/* GET Signup Page */
router.get("/signup", function (req, res, next) {
  res.render("signUp");
});

/* GET SignIn Page */
router.get("/signin", function (req, res, next) {
  res.render("signIn", { error: req.flash("error") });
});

/* GET Profile Page */
router.get("/profile", isLoggedIn, function (req, res, next) {
  res.render("profile");
});

/* Post Sigin */
router.post("/register", function (req, res) {
  // const userData = new userModel({
  //   username: req.body.username,
  //   email: req.body.email,
  //   fullName: req.body.fullName,
  // });

  //  OR

  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName }); // username: username - can be written as username only.

  // .register() - returns a promise.
  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate(
      "local" // takes - strategy
    )(req, res, function () {
      res.redirect("/profile");
    });
  });
});

/* Post Signin */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  }),
  function (req, res) {}
);

/* GET Logout */
router.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

/* Protected route config */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
