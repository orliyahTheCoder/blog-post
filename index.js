const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set("view engine", "ejs");

const PORT = 3000;

let posts = [];

// Render home page
app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

// Render the form to create a new post
app.get("/Post", (req, res) => {
  res.render("partials/Post.ejs");
});

// Create a new post
app.post("/submit", upload.single("userFile"), (req, res) => {
  const { name, desc } = req.body;
  const newPost = {
    id: posts.length + 1,
    name,
    desc,
    image: req.file ? req.file.buffer.toString("base64") : null,
  };
  posts.push(newPost);
  res.redirect("/");
});

// Delete a post
app.delete("/delete/:id", (req, res) => {
  const postId = req.params.id;
  posts = posts.filter((post) => post.id != postId);
  res.redirect("/");
});

// Render the edit form for a specific post
app.get("/edit/:id", (req, res) => {
  const postId = req.params.id;
  const postToEdit = posts.find((post) => post.id == postId);
  res.render("partials/Edit.ejs", { post: postToEdit });
});

// Update a post
app.post("/edit/:id", (req, res) => {
  const postId = req.params.id;
  const { name, desc } = req.body;
  const postIndex = posts.findIndex((post) => post.id == postId);
  if (postIndex !== -1) {
    posts[postIndex].name = name;
    posts[postIndex].desc = desc;
  }
  res.redirect("/");
});

app.listen(PORT, () =>
  console.log(`Listening at port: http://localhost:${PORT}`)
);
