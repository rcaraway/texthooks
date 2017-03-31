(function () {
	
	var app = angular.module("TextHooks", []);
	app.controller("HooksController", HooksController);

	function HooksController($scope, $http, $window, $browser){

		$scope.taskTapped = taskTapped;
		$scope.emailSearchTapped = emailSearchTapped;
		window.onSignIn = onSignIn;

		function init(){
			getCurrentTasks();		 
		}

		init();


		function getCurrentTasks(){
			$http.get("/api/tasks").success(function(tasks){
				$scope.tasks = tasks;
			});
		}

		function taskTapped(task){
			var name = task.name;
			if (name === "Send SMS from given email address"){
			 $window.location.href = $browser.baseHref()+"/search";
			}
		}

		function emailSearchTapped(keywords){
			
		}

		function onSignIn(googleUser) {
          var profile = googleUser.getBasicProfile();
          var id_token = googleUser.getAuthResponse().id_token;
          updateStatus("Authenticating server...");
          var user = {
          	"name" : profile.getName(),
          	"googleToken" : id_token,
          	"email" : profile.getEmail(),
          	"id" : profile.getId()
          };
	    	console.log("User:" + user.name);

          authenticateToBackend(user);
          console.log('ID TOKEN: ' + id_token); 
	    }

	    function authenticateToBackend(user){
	    	console.log("Authenticating:" + user);
		   $http.post("/api/authenticate", user)
           .success(function(authenticatedUser){
           	updateStatus("Checking for your account...");
          	findUser(user);
		  });
	    }

	    function updateStatus(message){
	    	$scope.status = message;
	    }

	    function findUser(user){
	    	console.log("Finding user client:" + user);
	    	$http.get("/api/users", user)
	    	.success(function(foundUser){
	    		console.log("FOUND USER:" + foundUser);
	    		if (foundUser != null){
		    		updateStatus("Welcome Back!");
	    		}else{
	    			updateStatus("Creating your account");
	    			createUser(user);
	    		}
	    	});
	    }

	    function createUser(user){
	    	$http.post("/api/users", user)
	    	.success(function (createdUser){
	    		console.log("USER CREATED I THINK");
	    	});
	    	console.log("MADE IT TO CREATION");
	    }

	}
})();