const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const session = require("express-session");
// const authController = require("./controllers/auth.js");
const mongoose = require("mongoose");
const methodOverRide = require("method-override");
const morgan = require("morgan");

const isSignedIn = require("./middleware/is-sign-in");
const passUserToView = require("./middleware/pass-user-to-view");
const authRouter = require("./routes/auth.js");
const recipesRouter = require("./routes/recipes.js");
// const ingredientsController = require("./controllers/ingredients.js");

const port = process.env.PORT ? process.env.PORT : 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(
    `Database is connected its name is : ${mongoose.connection.name}`
  );
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverRide("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.set("view engine", "ejs"); // Set EJS as the default view engine

// require("controller")
app.use(passUserToView);

// require("routes")
app.use("/auth", authRouter);
// const recipesRouter = require("./routes/recipes.js");
app.use("/recipes", recipesRouter);

app.use((req, res, next) => {
  if (req.session.messages) {
    res.locals.messages = req.session.messages;
    req.session.messages = null;
  } else {
    res.locals.messages = null;
  }
  next();
});

app.get("/", async (req, res) => {
  res.render("auth/sign-in.ejs");
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
