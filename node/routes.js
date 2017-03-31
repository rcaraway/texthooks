var express = require('express');
var app = express();
var schema = require('./database.js');
var bodyParser = require('body-parser');

var TaskModel = schema.getTaskModel();





function getAllTasks(req, res){
		
 console.log("pooped");
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


exports.createAllRoutes = function(directoryName) {
		console.log(directoryName);
		app.use(express.static(directoryName + '/public'));
		app.use(bodyParser.json()); 
		app.use(bodyParser.urlencoded({ extended: true })); 

		app.get('/', function (req, res) {
		  res.sendFile(directoryName + '/public/index.html');
		});

		app.get('/search', function(req,res){
		     res.sendFile(directoryName + '/public/emails.html');
		});

		app.get("/api/tasks", getAllTasks);
		app.get('/tasks',function(req,res){
		     res.sendFile(directoryName + '/public/tasks.html');
		});
};

