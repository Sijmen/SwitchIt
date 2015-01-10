angular.module('SwitchSetup', ['CouchDBSetup', 'WiringPiSetup', 'SwitchItSetup'])
.controller("SetupCtrl",function($scope, $http){
	$scope.continue = function(){
		$http.get("/?start=True&random="+Date.now());
		$scope.setup_continued = true;
	};

	$scope.start = function(){
		$http.get("/?start=True&random="+Date.now());
		$scope.setup_started = true;
	};
})
