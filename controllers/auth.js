const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Recipes = require("../models/recipes");
const bcrypt = require("bcrypt");
const isSignedIn = require("../middleware/is-sign-in");

const signup_get = (req, res) => {
  res.render("auth/sign-up");
};

const signup_post = async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (userInDatabase) {
    return res.send("Username already in database");
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Passwords do not match");
  }
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    res.redirect("/auth/sign-in");
  } catch {
    console.log(error);
    return res.send("Failed to create user. Please try again.");
  }
};

const signin_get = (req, res) => {
  res.render("auth/sign-in.ejs");
};

const signin_post = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login Failed Pleas Try Again");
    }
    const validPassword = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );
    if (!validPassword) {
      return res.send("Login Failed. Please try again.");
    }
    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
      createdAt: userInDatabase.createdAt,
    };
    res.render("recipes/show", { user: req.session.user });
  } catch (err) {
    console.log(err);
    req.session.messages = "Please try again later";
  }
};

const signout = (req, res) => {
  req.session.destroy();
  res.redirect("/auth/sign-in");
};

module.exports = {
  signout,
  signin_post,
  signin_get,
  signup_post,
  signup_get,
  router,
};
