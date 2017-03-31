var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/texthooks');

var TasksSchema = mongoose.Schema({
		name: String,
		description: String
	}, {collection: 'tasks'});

var UserSchema = mongoose.Schema({
	email: String,
	name: String,
	googleToken: String,
	id: String
}, {collection: 'users'}); 

var TaskModel = mongoose.model("TaskModel", TasksSchema);
var UserModel = mongoose.model("UserModel", UserSchema);


exports.getUserSchema = function(){
		return UserSchema;
};

exports.getTasksSchema = function(){
		return TasksSchema;
};

exports.getTaskModel = function(){
		return TaskModel;
};

exports.getUserModel = function(){
	return UserModel;
}