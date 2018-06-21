var express 	= require("express");
var router  	= express.Router({mergeParams: true});
var Recipe 		= require("../models/recipe");
var Comment 	= require("../models/comment");
var middleware 	= require("../middleware");

//Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find recipe by id
	Recipe.findById(req.params.id, function(err, foundRecipe){
		if (err){
			console.log(err);
		} else {
			res.render("comments/new", {recipe: foundRecipe});
		}
	});
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup recipe using id
	Recipe.findById(req.params.id, function(err, recipe){
		if (err){
			console.log(err);
			res.redirect("/recipes");
		} else {
			Comment.create(req.body.comment, function(err, newlyCreated){
				if (err){
					req.flash("error", "Something went wrong!");
					console.log(err);
				} else {
					//add username and id to comment
					newlyCreated.author.id = req.user._id;
					newlyCreated.author.username = req.user.username;
					//save comment
					newlyCreated.save();
					recipe.comments.push(newlyCreated);
					recipe.save();
					req.flash("success", "Successfully created comment!");
					res.redirect("/recipes/" + recipe._id);
				}
			});
		}
	});
});

//Comment EIDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err){
			res.redirect("recipes/" + req.params.id);
		} else {
			res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
		}
	});
});

//Comment UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err){
			res.redirect("back");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

//COMMET DESTORY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("/recipes/" + req.params.id);
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/recipes/" + req.params.id);
		}
	});
});

module.exports = router;