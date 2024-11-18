const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe");

// Define the route for usersList to display a list of users
router.get("/usersList", recipeController.showUsersList);

// Define the route for viewing other users' recipes
router.get("/otherUsersRecipes", recipeController.otherUsersRecipes);

// Other routes follow
router.get("/show", recipeController.showRecipes);
router.get("/", recipeController.index);
router.get("/new", recipeController.newRecipe);
router.get("/:recipeId", recipeController.getById);
router.post("/", recipeController.createRecipe);
router.get("/:recipeId/edit", recipeController.editRecipes);
router.put("/:recipeId", recipeController.updateRecipes);
router.delete("/:recipeId", recipeController.deleteRecipes);

module.exports = router;
