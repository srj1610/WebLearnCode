var campground= require("../models/campground");
var comment =require("../models/comment");

// all the middleware goes here
var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    //is user loggedd in?
    if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }else{
            //does user own campground?
            if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            }else{
                req.flash("error", "You don't have premission to do that");
                res.redirect("back");
            }
                }
            });
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
     if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            }else{
            //does user own campground?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            }else{
                req.flash("error", "You don't have premission to do that");
                res.redirect("back");
            }
                }
            });
        }else{
            req.flash("error", "You need to be logged in to that");
            res.redirect("back");
    }
};

middlewareObj.isLoggedIn =function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","please loggin first");
    res.redirect("/login");
};

module.exports = middlewareObj;