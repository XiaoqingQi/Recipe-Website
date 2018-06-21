var express 				= require("express");
var app 					= express();
var mongoose 				= require("mongoose");
var expressSession 			= require("express-session");
var passport 				= require("passport");
var localStrategy 			= require("passport-local");
var passportLocalMongoose 	= require("passport-local-mongoose");
var bodyParser 				= require("body-parser");
var methodOverride 			= require("method-override");
var flash 					= require("connect-flash");
var User 					= require("./models/user");
var Recipe 					= require("./models/recipe");
var Comment 				= require("./models/comment");

//requiring routes
var recipeRouter 			= require("./routes/recipes");
var indexRouter 			= require("./routes/index");
var commentRouter 			= require("./routes/comments");

//Connect with mongodb
mongoose.connect("mongodb://localhost/Recipes");

//App config
app.set("view engine", "ejs");
app.use(express.static("/Users/qxq/Downloads/WebDev/RecipeWebsite" + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

//Passport Configuration
app.use(expressSession({
	secret: "Allen is the best in the world",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This function will be called on every single route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
//Config routes
app.use("/recipes", recipeRouter);
app.use(indexRouter);
app.use("/recipes/:id/comments", commentRouter);

//Start server
app.listen(8080, function(){
    console.log("The Server has started..");
});