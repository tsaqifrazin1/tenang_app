require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const cors = require("cors");
const { errorHandler } = require("./src/middleware");
const logger = require("morgan");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(logger("dev"));

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the Database successfully");
  });

const route = require("./src/routes");

app.use("/api/v1", route);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is listening on Port:", PORT);
});

module.exports = app;
