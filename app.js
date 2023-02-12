//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/postsDB");
mongoose.connect(process.env.CONN_STRING);

// let posts = [];

let postSchema = new mongoose.Schema({
  title : String,
  content : String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  res.sendStatus(200);
  Post.find(function(err, posts){
    if(err){
      console.log(err);
      res.status(200).render("home", {
        startingContent: homeStartingContent,
        posts: []
        });
    }
    else{
      res.status(200).render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    }
  });

});

app.get("/about", function(req, res){
  res.status(200).render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.status(200).render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.status(200).render("compose");
});

app.post("/compose", function(req, res){
  const thisPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //posts.push(post);
  thisPost.save(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Doc saved successfuly...");
      res.redirect("/");
    }
  });




});

app.get("/posts/:postName", function(req, res){

  Post.findById(req.params.postName, function(err, thepost){
    if(err){
      //Error means findById() has failed that is search was requested by post title or i.o.w we wre directed here by user providing the url as /posts/day2
      const requestedTitle = _.lowerCase(req.params.postName);

      Post.find(function(err, posts){

        posts.forEach(function(post){
          const storedTitle = _.lowerCase(post.title);

          if (storedTitle === requestedTitle) {
            res.status(200).render("post", {
              title: post.title,
              content: post.content
            });
          }
        });
      })
    }else{
      //No error means findById() has found matching id or i.o.w we were directed here by the Read More.. button
      res.status(200).render("post", {
        title: thepost.title,
        content: thepost.content
      });
    }
  })





});

app.listen(prcocess.env.PORT || 3000, function() {
  console.log("Server started on requested port..");
});
