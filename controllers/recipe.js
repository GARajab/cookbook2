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
    res.render("recipes/index.ejs", { listings: populatedRecipes });
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

  try {
      await Recipes.create(req.body);
      res.redirect("/recipes");
  } catch (error) {
      console.log(error);
      res.status(500).send("Error creating recipe.");
  }
};

const editRecipes = async (req, res) => {
  try {
    const currentRecipe = await Recipes.findById(req.params.recipeId);
    res.render("../recipes/edit.ejs", {
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
    if (!currentRecipe) {
      res.status(404).send("Recipe not found.");
      return;
    }
    if (!currentRecipe.owner.equals(req.session.user._id)) {
      return res.status(403).send("You don't have permission to do that.");
    }
    await currentRecipe.updateOne(req.body);
    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

const deleteRecipes = async (req, res) => {
  try {
    const currentRecipe = await Recipes.findById(req.params.recipeId);
    if (!currentRecipe) {
      res.status(404).send("Recipe not found.");
      return;
    }
    if (!currentRecipe.owner.equals(req.session.user._id)) {
      return res.status(403).send("You don't have permission to do that.");
    }
    await currentRecipe.deleteOne();
    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
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
module.exports = {
  newRecipe,
  deleteRecipes,
  updateRecipes,
  editRecipes,
  getById,
  createRecipe,
  index,
};
