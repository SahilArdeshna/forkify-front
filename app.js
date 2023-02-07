const path = require("path");
const express = require("express");
require("dotenv").config();

const port = process.env.PORT || 8080;

const app = express();

app.use(express.static("dist"));

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(port);
