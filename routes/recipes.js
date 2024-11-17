const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe");

router.get("/", recipeController.index);
router.get("/new", recipeController.newRecipe);
router.get("/:recipeId", recipeController.getById);
router.post("/", recipeController.createRecipe);
router.get("/:recipeId/edit", recipeController.editRecipes);
router.put("/:recipeId", recipeController.updateRecipes);
router.delete("/:recipeId", recipeController.deleteRecipes);

module.exports = router;
