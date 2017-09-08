var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs = require('fs');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var session = require('express-session');


// configuration =================
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use('/static', express.static(__dirname + '/public'));
app.use(session({ secret: 'password', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

fs.readFile('secrets.json', 'utf8', function (err, data) {
  	if (err) throw err;
  	var secrets = JSON.parse(data);
	console.log(secrets);
	passport.use(new Strategy({
    		clientID: secrets.clientID,
    		clientSecret: secrets.clientSecret,
    		callbackURL: secrets.callbackURL
  	},
  	function(accessToken, refreshToken, profile, cb) {
    		return cb(null, profile);
  	}
	));
});

passport.serializeUser(function(user, cb) {
	cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

function isNumber(obj) { return !isNaN(obj); }

//api to add and update charge
app.get('/api/charges', function(req, res) {
	//if('user' in req && req.user.id == 1289524871059128){
    if(!req.session.logged_in){
		res.json({"logged_in":"false"});
	}else{
		var chargesText = fs.readFileSync(req.session.chargesFile);
		res.json(JSON.parse(chargesText));
	}
});

app.get('/api/clear', function(req, res) {
	//if('user' in req && req.user.id == 1289524871059128){
    if(!req.session.logged_in){
		res.json({"logged_in":"false"});
	}else{
		var chargesText = fs.readFileSync(req.session.chargesFile);
		allCharges = JSON.parse(chargesText);
		allCharges.charges = [];
		allCharges.balance = allCharges.budget;
		fs.writeFile(req.session.chargesFile, JSON.stringify(allCharges), function(err){
		if(err) {
			 console.log(err);
		 } else {
			 console.log("JSON saved to json file");
		 }});
		res.json(allCharges);
	}
});

app.post('/api/setBudget', function(req, res){
    if(!req.session.logged_in){
        res.json({"logged_in":"false"});
    }else{
        var newBudget = req.body.budget;
        //if is number and bigger than zero
        console.log(newBudget);
        console.log(req.body);
        if( !isNaN(newBudget) && newBudget > 0){
            var chargesText = fs.readFileSync(req.session.chargesFile);
        	var allCharges = JSON.parse(chargesText);

            var oldBudget = allCharges.budget;
            allCharges.budget = newBudget;
            allCharges.balance = allCharges.balance + (newBudget - oldBudget);

            fs.writeFile(req.session.chargesFile, JSON.stringify(allCharges), function(err){
    		if(err) {
    			 console.log(err);
    		 } else {
    			 console.log("JSON saved to json file");
    		 }});

             res.json(allCharges);
        }else{
            res.send("enter a valid number please");
        }
    }
});

app.post('/api/charges', function(req, res) {
    //if('user' in req && req.user.id == 1289524871059128){
    if(!req.session.logged_in){
        res.json({"logged_in":"false"});
	}else{
    	var newCharge = {"item":req.body.item, "charge":req.body.charge};

    	var chargesText = fs.readFileSync(req.session.chargesFile);
    	var allCharges = JSON.parse(chargesText);

    	//if charge is a number, add it, otherwise return what we already have
    	if(isNumber(newCharge.charge)){
    		allCharges.charges.push(newCharge);
    		allCharges.balance -= req.body.charge;
		allCharges.balance = allCharges.balance.toFixed(2);
    		fs.writeFile(req.session.chargesFile, JSON.stringify(allCharges), function(err){
    		if(err) {
    	         console.log(err);
    	     } else {
    	         console.log("JSON saved to json file");
    	     }});
    	}

    	res.json(allCharges);
    }
});

app.get('/', function(req, res) {
	if(req.session.logged_in){
		//res.redirect('/budget/static/index.html');
        res.sendFile(__dirname + '/public/index.html');
	}else{
    	res.redirect('/budget/login/facebook'); // load the single view file (angular will handle the page changes on the front-end)
	}
});



app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/facebook/return',
  	passport.authenticate('facebook', { failureRedirect: '/login/facebook' }),
  	function(req, res) {
		//login success
        console.log(JSON.stringify(req.user));
        //not needed because facebook apps in development require explicit testers in apps dashboard
        // if(req.user.id != 1289524871059128 || ){
        //     res.send("INTRUDER ALERT! INTRUDER ALERT! Access has been DENIED");
        //     req.session.logged_in = false;
        // }else{
            req.session.chargesFile = __dirname + "/" + req.user.id + ".json";
            fs.stat(req.session.chargesFile, function(err, stat) {
                if (err) {
                    //create the file
                    var seed = {"budget":300,"charges":[],"balance":300};
                    fs.writeFile(req.session.chargesFile, JSON.stringify(seed), function(err){
                		if(err) {
                	         console.log(err);
                	     } else {
                	         console.log("Seed saved to json file");
            	     }});

                }
            });
            req.session.logged_in = true;
            res.redirect('/budget');
        //}
  	});



// listen (start app with node server.js) ======================================
app.listen(8888);
console.log("App listening on port 8888");
