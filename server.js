var express = require('express');
var app = express();
var schema = require('./node/database.js');
var bodyParser = require('body-parser');
var verifier = require('google-id-token-verifier');

var TaskModel = schema.getTaskModel();
var UserModel = schema.getUserModel();

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


var gmailServerId = "465135005527-16pu959ts9vv6mekuv14i2fprcfmsv9o.apps.googleusercontent.com";
var gmailSecret = "izpb_TtyXZzJjbU8o7Dxx1Mj";


var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly',
			  'https://www.googleapis.com/auth/gmail.compose'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.get('/search', function(req,res){
     res.sendFile(__dirname + '/public/emails.html');
});
app.get("/api/tasks", getAllTasks);
app.get('/tasks',function(req,res){
     res.sendFile(__dirname + '/public/tasks.html');
});
app.post("/api/authenticate", authenticateUser);
app.get("/api/users", getUser);
app.post("/api/users", createUser);


function authenticateUser(req, res){

	var user = req.body;
	var userID = req.body.id;
	var tokenId = req.body.googleToken;
	var clientId = '465135005527-ptedi907v01re1a9mm920eukhi2615pt.apps.googleusercontent.com';
	verifier.verify(tokenId, clientId, function (err, tokenInfo) {
	  if (!err) {
	    console.log(tokenInfo);
	    res.json(user);
	  }else{
	  	res.sendStatus(400);
	  }
	});
}

function getUser(req, res){
	var user = req.body;
	console.log("Finding user by ID" + user.id);
	UserModel.findOne({"id": user.id})
	.then(
		function (existingUser){
			console.log("User found? " + existingUser);
			res.json(existingUser);
		},
		function (error){
			res.sendStatus(400);
		}
		);
}

function getAllTasks(req, res){
	TaskModel.find()
	.then(
	   	function (tasks){
	   		res.json(tasks);
	   	},
	   	function (error){
	   		res.sendStatus(400);
	   	}
	   	);
}

function createUser(req, res){
	var user = req.body;
	UserModel.create(user)
	.then(
		function(status){
			res.json(user);
		},
		function (error){
			res.sendStatus(400);
		}
	)
}


app.listen(3001);