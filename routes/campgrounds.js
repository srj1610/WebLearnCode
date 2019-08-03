var express= require("express");
var router = express.Router();
var campground= require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/",function(req,res){
    campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form and add to campgrounds array
    var name= req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground={name: name, price:price, image: image, description: desc, author: author};
    //create a new campground and save to db
    campground.create(newCampground,function(err,newlyCreated){
        if(err){
             console.log(err);
        }else{
            
             //redirect back to campgrounds page
             res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id",function(req,res){
    //find the campground with provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
                req.flash("error", "Something went wrong.");
                res.redirect("/");
        }else{
            //render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});

//Edit campground routes
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
            campground.findById(req.params.id, function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
            });
        });
//update campground routes
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update of current campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;