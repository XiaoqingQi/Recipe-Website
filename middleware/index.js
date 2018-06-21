var Recipe 	= require("../models/recipe");
var Comment = require("../models/comment");

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next){
	if (req.isAuthenticated()){
		Recipe.findById(req.params.id, function(err, foundRecipe){
			if (err){
				req.flash("error", "Recipe not found!");
				res.redirect("/recipes");
			} else {
				if (foundRecipe.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("/recipes");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if (req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err){
				res.redirect("/recipes/" + req.params.id);
			} else {
				if (foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("/recipes/" + req.params.id);
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};

module.exports = middlewareObj;