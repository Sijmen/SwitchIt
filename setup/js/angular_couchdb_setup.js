angular.module('CouchDBSetup', [])
.controller('CouchDBSetupCtrl', function($scope, $http, $timeout) {
	(function tick(){
		if($scope.setup_started){
			$http.get("/?update=True").then(function(resp) {

				// $scope.time = resp.data.time;
				$scope.data = resp.data.CouchDB;
				console.log(resp);
			    // For JSON responses, resp.data contains the result
			}, function(err) {
				console.error('ERR', err);
		    // err.status will contain the status code
			})
		}
		$timeout(tick,2500);
	})();

	if (!$scope.login_status){
		$scope.login_status = {};
	}
	$scope.login = function(){
		if($scope.couchdb && $scope.couchdb.password && $scope.couchdb.name){
			console.log($scope.couchdb);
			$http.get('/', {params:{couchdb:"login", name:$scope.couchdb.name, password:$scope.couchdb.password}})
			.success(function(data, status, headers, config){
				$scope.login_status.message = data.message;
				$scope.login_status.success = true;
				$scope.continue();
			})
			.error(function(data, status, headers, config){
				$scope.login_status.message = data.message;
				$scope.login_status.success = false;
			})
		}
	};
})

