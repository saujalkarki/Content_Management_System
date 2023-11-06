const express = require("express");
const { blogs } = require("./model/index.js");
const app = express();

// saying node that we are using .env
require("dotenv").config();

// saying node that we are using index.js
require("./model/index.js");

// saying node that we are using ejs
app.set("view engine", "ejs");

// telling nodejs to accept the incoming data (parsing data)
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("allBlogs.ejs");
});

app.get("/addBlog", (req, res) => {
  res.render("addBlog.ejs");
});

// api for handling form data's
app.post("/addBlog", async (req, res) => {
  await blogs.create({
    title: req.body.title,
    subTitle: req.body.subtitle,
    description: req.body.description,
  });
  res.send("Blogs stored successfully");
});

//taking variable from .env
console.log(process.env.name);
console.log(process.env.PORT);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`CMS project has been started in port ${PORT}`);
});
