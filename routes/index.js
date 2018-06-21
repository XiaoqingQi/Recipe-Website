var express 	= require("express");
var router  	= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");
var Recipe 		= require("../models/recipe");

//root route
router.get("/", function(req, res){
	Recipe.find({}, function(err, recipes){
		if (err){
			console.log(err);
		} else {
			var len = recipes.length;
			if (recipes.length > 4){
				newRecipes = [recipes[len - 1], recipes[len - 2], recipes[len - 3], recipes[len - 4]];
				res.render("homepage", {recipes: newRecipes});
			} else {
				res.render("homepage", {recipes: recipes});
			}
		}
	});
});

//show register form
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up form
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome " + req.body.username);
			res.redirect("/");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/recipes",
	failureRedirect: "/login"
}), function(req, res){

});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/")
});

module.exports = router;