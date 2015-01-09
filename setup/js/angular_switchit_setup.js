angular.module('SwitchItSetup', [])
.controller('SwitchItSetupCtrl', function($scope, $http, $timeout) {
	(function tick(){
		if($scope.setup_started){
			$http.get("/?update=True").then(function(resp) {

				// $scope.time = resp.data.time;
				$scope.data = resp.data.switchcode;
				console.log(resp);
			    // For JSON responses, resp.data contains the result
			}, function(err) {
				console.error('ERR', err);
		    // err.status will contain the status code
			})
		}
		$timeout(tick,2300);
	})();
})

