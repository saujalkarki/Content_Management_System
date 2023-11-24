const express = require("express");
const { blogs, users } = require("./model/index.js");
const bcrypt = require("bcrypt");
const fs = require("fs");

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
  // console.log(allBlogs);
  res.render("allBlogs.ejs", { blogs: allBlogs });
});

// get single blog

app.get("/blogs/:id", async (req, res) => {
  const id = req.params.id;

  // aako id ko data blogs table bata fetch/find garnu paryo
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  // we can do the same above thing by this method too
  //  const blog  = await blogs.findByPk(id)

  res.render("singleBlog", { blog });
});

// to delete
app.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  const fileName = blog[0].imageUrl;
  const lengthToCut = "http://localhost:3000/".length;
  const fileNameAfterCut = fileName.slice(lengthToCut);

  fs.unlink("./uploads/" + fileNameAfterCut, function (err) {
    if (err) {
      console.log("error happened while deleting");
    } else {
      console.log("sucessfully deleted");
    }
  });
  // aako id ko data(row) chae blogs vanney table bata delete garnu paryo
  await blogs.destroy({
    where: {
      id: id,
    },
  });
  res.redirect("/addBlog");
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
    imageUrl: process.env.BackEnd_URL + req.file.filename,
  });
  res.redirect("/");
  //res.render("addBlog.ejs");
});

// edit
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await blogs.findAll({
    where: {
      id: id,
    },
  });
  res.render("editblog.ejs", { blog: blog });
});

// edit form bata aako kura handle
// app.post("/edit/:id", (req, res) => {
// console.log(req.body);
// });
app.post("/edit/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, subtitle, description } = req.body;
  let fileName;

  if (req.file) {
    fileName = req.file.filename;
  }

  // old data
  const oldData = await blogs.findAll({
    where: {
      id: id,
    },
  });
  const oldFileName = oldData[0].imageUrl;
  const lengthToCut = "http://localhost:3000/".length;
  const oldFileNameAfterCut = oldFileName.slice(lengthToCut);

  if (fileName) {
    fs.unlink("./uploads/" + oldFileNameAfterCut, (err) => {
      if (err) {
        console.log("Error detected while deleting");
      } else {
        console.log("successfully cleared");
      }
    });
  }

  // console.log(fileName);
  // return;
  await blogs.update(
    {
      title,
      subTitle: subtitle,
      description,
      imageUrl: fileName ? process.env.BackEnd_URL + fileName : fileName,
    },
    {
      where: {
        id: id,
      },
    }
  );

  // res.redirect("/");
  res.redirect("/blogs/" + id);
});

// register
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  console.log(userName, email, password, confirmPassword);
  await users.create({
    userName,
    email,
    password: bcrypt.hashSync(password, 10),
    confirmPassword: bcrypt.hashSync(confirmPassword, 10),
  });

  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  // access email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("Please provide email and password");
  }
  // check if email exist or not
  const user = await users.findAll({
    where: {
      email: email,
    },
  });
  if (user.length == 0) {
    res.send("User doesn't exist with that email");
  } else {
    //check password matches or not
    const isPasswordMatched = bcrypt.compareSync(password, user[0].password);
    if (isPasswordMatched) {
      res.send("loggedIn Successfully");
    } else {
      res.send("Invalid password");
    }
  }
});

app.use(express.static("./uploads"));

//taking variable from .env
// console.log(process.env.name);
// console.log(process.env.PORT);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`CMS project has been started in port ${PORT}`);
});
