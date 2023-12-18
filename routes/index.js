var express = require("express");
var router = express.Router();

const userModel = require("./users");
const postModel = require("./posts");

const passport = require("passport");
const localStrategy = require("passport-local");

const upload = require("./multer");

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
router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  }).populate('posts');
  console.log(user);
  res.render("profile", { user });
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

/* Post route for uploads*/
router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res) {
    if (!req.file) {
      return res.status(400).send("No files were uploaded");
    }

    // file which is being uploaded save that file as a post in DB. And
    // provide the post id of this post to the user - and similarly user id to the post.

    // Get User:
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });

    // Create Post having user id:
    const postData = await postModel.create({
      image: req.file.filename,
      postText: req.body.postText,
      user: user._id,
    });

    // put the post id inside the user db
    user.posts.push(postData._id);

    await user.save();

    res.send("File uploaded successfully");
  }
);

/* Protected route config */
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
