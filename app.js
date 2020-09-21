 
var express = require("express");
var app = express();
// to render template files, don't have to type out .ejs, just filename
app.set("view engine", "ejs"); 
// to use body parser
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
// to use images/css stylesheets: static files in express must be inside directory 
//    specified in static middleware (eg. 'public'), this line tells ejs to serve 
//    public directory
app.use(express.static( "public" ));

// use mongoose, connect to mongo DB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cafe_rater', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Schema - will move later
const cafeSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

// Model - convert Schema to model
const Cafe = mongoose.model("Cafe", cafeSchema);

//landing page
app.get("/", function(req, res){
	res.render("landing");
});

//INDEX, page to see all cafes
app.get("/allCafes", function(req, res){
	// get all cafes from DB
	Cafe.find({}, function(err, cafeList){
		if (err){ console.log(err); }
		else{
			res.render("index", {cafes: cafeList});
		}
	})
});

// CREATE
// add cafe to db
app.post("/allCafes", function(req, res){
	console.log("Post a cafe!")
	//var cafeName = req.body.cafeName;
	//var cafeImage = req.body.cafeImage;
	var addCafe = {name: req.body.cafeName, image: req.body.cafeImage};
	Cafe.create( addCafe, function(err, cafe){
		if(err){ console.log(err); }
		else{
			console.log("Added cafe to DB");
			console.log(cafe);
		}
	});	
	//default redirects to get request
	res.redirect("/index");
});

//NEW, form to create new cafe
app.get("/allCafes/new", function(req, res){
	res.render("newCafe");
}); 


app.listen(3000, console.log("listening to port 3000"));
