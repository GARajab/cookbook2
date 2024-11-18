const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  nameOfRecipe: { type: String, required: true },
  instruction: { type: String, required: true },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: false,
    },
  ], // An array of ObjectIds
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
