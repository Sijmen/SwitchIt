angular.module('SwitchItSetup', [])
.controller('SwitchItSetupCtrl', function($scope, $http, $timeout) {
	(function tick(){
		if($scope.setup_started){
			$http.get("/?update=True").then(function(resp) {
				$scope.data = resp.data.switchcode;
			}, function(err) {
				$scope.no_data = true;
		    // err.status will contain the status code
			})
		}
		$timeout(tick,2300);
	})();
})

