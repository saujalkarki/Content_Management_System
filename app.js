const express = require("express");
const { blogs } = require("./model/index.js");

// requiring multerConfig

// const multer = require("./middleware/multerConfig.js").multer;
// const storage = require("./middleware/multerConfig.js").storage;
// This above code can also be written as below:
const { multer, storage } = require("./middleware/multerConfig.js");
const upload = multer({ storage: storage });

const app = express();

// saying node that we are using .env
require("dotenv").config();

// saying node that we are using index.js
require("./model/index.js");

// saying node that we are using ejs
app.set("view engine", "ejs");

// telling nodejs to accept the incoming data (parsing data)
app.use(express.json()); //contentType= application/json handle
app.use(express.urlencoded({ extended: true })); //contentType= application/x-www-form-urlencoded

app.get("/", async (req, res) => {
  const allBlogs = await blogs.findAll();
  console.log(allBlogs);
  res.render("allBlogs.ejs", { blogs: allBlogs });
});

app.get("/addBlog", (req, res) => {
  res.render("addBlog.ejs");
});

// api for handling form data's
app.post("/addBlog", upload.single("image"), async (req, res) => {
  // const title = req.body.title;
  // const subTitle = req.body.subtitle;
  // The above code can be done by destructuring method too:
  const { title, subtitle, description } = req.body;

  await blogs.create({
    // all the below 3 approaches are same
    // title,
    // subTitle: subTitle,
    // description: req.body.description,
    title,
    subTitle: subtitle,
    description,
    imageUrl: req.file.filename,
  });
  res.send("Blogs stored successfully");
  //res.render("addBlog.ejs");
});

app.use(express.static("./uploads"));

//taking variable from .env
console.log(process.env.name);
console.log(process.env.PORT);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`CMS project has been started in port ${PORT}`);
});
