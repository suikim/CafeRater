// use Express
var express = require("express");
var app = express();
// to render template files, don't have to type out .ejs, just filename
app.set("view engine", "ejs"); 
// to use body parser
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
// to use images/css stylesheets: static files in Express must be inside directory 
//    specified in static middleware (eg. 'public'), this line tells ejs to serve 
//    public directory
app.use(express.static( "public" ));

// use Mongoose, connect to mongo DB
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

//add starting data
// Cafe.create(
// 	{
// 		name: "Verve",
// 		image: "https://cdn.shopify.com/s/files/1/0035/9372/files/locations__pac_ave_900x.jpg?",
// 		description: "I come here for espresso and pour over drinks. One of my favorite Mochas. Food/baked goods are a bit pricey, but are very good as well. Have not tried tea here yet, but many rave about the bowl of soul."
// 	}, 
// 	function (err, cafe) {
//   		if (err) {
//   			console.log("err")
// 	  		return handleError(err);
// 	  	}
//   		else{
//   			console.log(cafe);
//   		}
// });

// landing page
app.get("/", function(req, res){
	res.render("landing");
});

//INDEX, page to see all cafes
app.get("/allCafes", function(req, res){
	// get all cafes from DB with '.find({}, func...)''
	Cafe.find({}, function(err, cafeList){
		if (err){ console.log(err); }
		else{
			res.render("index", {cafes: cafeList});
		}
	});
});

// CREATE, add cafe to db
app.post("/allCafes", function(req, res){
	console.log("Post a cafe!")
	//var cafeName = req.body.cafeName;
	//var cafeImage = req.body.cafeImage;
	var addCafe = {name: req.body.cafeName, image: req.body.cafeImage, description: req.body.cafeDesc};
	Cafe.create( addCafe, function(err, cafe){
		if(err) { console.log(err); }
		else {
			console.log("Added cafe to DB");
			console.log(cafe);
		}
	});	
	//default redirect to GET request
	res.redirect("/allCafes");
});

//NEW, form to create new cafe
app.get("/allCafes/new", function(req, res){
	res.render("newCafe");
}); 

// SHOW: shows more info for specific cafe
// placed after /allCafes/new so that the 'new' route is not caught by /allCafes/:id
// finds cafe by id and renders show template
app.get("/allCafes/:id", function(req, res){
	// had to add .trim() to get rid of space in front of id 
	Cafe.findById(req.params.id.trim(), function(err, singleCafe){
		//console.log(req.params.id);
		//console.log(typeof req.params.id);
		if (err){ console.log(err); }
		else{
			res.render("show", {cafe: singleCafe});
		}
	});
});

app.listen(3000, console.log("listening to port 3000"));
