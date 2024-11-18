const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Recipes = require("../models/recipes");
const bcrypt = require("bcrypt");
const isSignedIn = require("../middleware/is-sign-in");

const index = async (req, res) => {
  try {
    const populatedRecipes = await Recipes.find({}).populate("owner");
    console.log("Populated Recipes: ", populatedRecipes);
    res.render("recipes/index.ejs", { recipes: populatedRecipes });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const newRecipe = async (req, res) => {
  res.render("recipes/new.ejs");
};

const createRecipe = async (req, res) => {
  console.log(req.body);

  // Check if user is authenticated
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Please log in.");
  }

  req.body.owner = req.session.user._id;
  req.body.ingredients = req.session.user._id;

  try {
    const newRecipe = await Recipes.create(req.body); // Ensure `Recipe` model is imported correctly
    console.log("New Recipe Created:", newRecipe);
    res.redirect("/recipes");
  } catch (error) {
    console.log("Error creating recipe:", error);
    res.status(500).send("Error creating recipe.");
  }
};

const editRecipes = async (req, res) => {
  try {
    const currentRecipe = await Recipes.findById(req.params.recipeId);
    res.render("recipes/edit.ejs", {
      recipes: currentRecipe,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

const updateRecipes = async (req, res) => {
  try {
    const currentRecipe = await Recipes.findById(req.params.recipeId);
    await currentRecipe.updateOne(req.body);
    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

const deleteRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.findById(req.params.recipeId);
    await recipes.deleteOne();
    res.redirect("/recipes");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};

const getById = async (req, res) => {
  try {
    const populatedRecipes = await Recipes.findById(
      req.params.recipeId
    ).populate("owner");
    User.equal(req.session.user._id);
    res.render("recipes/show.ejs", { recipes: populatedRecipes });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

const showRecipes = async (req, res) => {
  try {
    const populatedRecipes = await Recipes.find({}).populate("owner");
    res.render("recipes/show.ejs", { recipes: populatedRecipes }); // Render a views file called show.ejs
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

const showUsersList = async (req, res) => {
  try {
    const allUsers = await User.find({}, "username");

    res.render("recipes/usersList.ejs", { users: allUsers });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
const otherUsersRecipes = async (req, res) => {
  try {
    // Get the userId from the query parameters
    const userId = req.query.userId;

    // Find all recipes for that user
    const allUsersRecipes = await Recipes.find({ owner: userId }).populate(
      "owner"
    );

    // Render the otherUsersRecipes.ejs view with the recipes
    res.render("recipes/otherUsersRecipes.ejs", { recipes: allUsersRecipes });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};

module.exports = {
  newRecipe,
  deleteRecipes,
  updateRecipes,
  editRecipes,
  getById,
  createRecipe,
  index,
  showRecipes,
  showUsersList,
  otherUsersRecipes,
};
