var express        =require("express");
var app            =express();
var mongoose       =require("mongoose");
var bodyParser     =require("body-parser");
var methodOverride =require("method-override");
var expressSanitize=require("express-sanitizer");

//APP Configuration
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitize());

//Mongoose/model

var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);


//RESTFUL ROUTES

app.get("/",function(req, res) {
    res.redirect("/blogs");
});

// INDEX ROUTES
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("ERROR!");
        }
        else{
               res.render("index",{blogs:blogs});
        }
    });
});

// NEW ROUTES

app.get("/blogs/new",function(req,res){
    res.render("new");
});

//POST ROUTE
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,blog){
       if(err){
           console.log("ERROR!");
       }
       else{
           res.redirect("/blogs");
       }
   });
});

// Show Routes
app.get("/blogs/:id",function(req, res) {
   Blog.findById(req.params.id,function(err,blog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("show",{blog:blog});
       }
   });
});

//Edit route
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,blog){
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("edit",{blog:blog});
       }
    });
});

//Update Route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatesBlog){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

//Delete Routes
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
     if(err){
           res.redirect("/blogs");
       }else{
           res.redirect("/blogs");
       }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER STARTED");
});
