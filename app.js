const express = require("express");
const app = express();

// saying node that we are using .env
require("dotenv").config();

// saying node that we are using index.js
require("./model/index.js");

// saying node that we are using ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("allBlogs.ejs");
});

app.get("/addBlog", (req, res) => {
  res.render("addBlog.ejs");
});

//taking variable from .env
console.log(process.env.name);
console.log(process.env.PORT);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`CMS project has been started in port ${PORT}`);
});
