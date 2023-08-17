const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const { Recipe, Diets } = require("./models");

require("./db.js");

const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/", routes);

server.get("/recipes/:idRecipe", async (req, res) => {
  const { idRecipe } = req.params;
  try {
    const recipe = await Recipe.findByPk(idRecipe, {
      include: Diets,
    });

    if (!recipe) {
      return res.status(404).jaon({ message: "Recipe not found" });
    }
    return res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

server.get("/recipes/name", async (req, res) => {
  const { name } = req.query;
  try {
    const recipes = await Recipe.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
    return res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

server.post("/recipes", async (req, res) => {
  const { id, name, image, summaryDish, healthScore, stepByStep } = req.body;
  try {
    const newRecipe = await Recipe.create({
      id,
      name,
      image,
      summaryDish,
      healthScore,
      stepByStep,
    });
    await newRecipe.addDiets(diets);
    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

server.get("/diets", async (req, res) => {
  try {
    const diets = await Diets.findAll();
    return res.json(diets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
