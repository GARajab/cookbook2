const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  nameOfRecipe: { type: String, required: true },
  instruction: { type: [String], default: [] },
  ingredient: { type: [String], default: [] },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
