angular.module('switch_angular', ['ngRoute','ngResource','CornerCouch'])

.value('dbName', 'switchit')
.value('vwName', 'switches')
.value('dgName', 'switchit')

.factory('Switches',function(cornercouch,dbName,vwName, dgName){
  server = cornercouch();
  db = server.getDB(dbName);
  db.query(dgName, vwName);
  // console.log(db.rows);
  return db.query(dgName, vwName);

  // return [{"name":"Test","id":"testid",'description':"test description"}];
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'ListCtrl',
      templateUrl:'buttons/list.html'
    })
    .when('/edit/:projectId', {
      controller:'EditCtrl',
      templateUrl:'buttons/edit.html'
    })
    .when('/new', {
      controller:'CreateCtrl',
      templateUrl:'buttons/edit.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('ListCtrl', function($scope, $http, Switches) {
  // console.log(Switches.rows)
  Switches.then(function(promise){
    $scope.switches = promise.data.rows;
    $scope.rows = chunk(promise.data.rows,3);
  });

  $scope.turnOn = function(switchit) {
    $http({method:"POST",data:{ids:switchit.idlist,state:'on'}, url:'/_nodejs'});
  };

  $scope.turnOff = function(switchit) {
    $http({method:"POST",data:{ids:switchit.idlist,state:'off'}, url:'/_nodejs'});
  };
})

.controller('CreateCtrl', function($scope, $location, Switches) {
  $scope.save = function() {
      Switches.$add($scope.switchit).then(function(data) {
          $location.path('/');
      });
  };
})

.controller('EditCtrl',
  function($scope, $location, $routeParams, Switches) {
    var projectId = $routeParams.projectId,
        projectIndex;

    $scope.switches = Switches;
    projectIndex = $scope.switches.$indexFor(projectId);
    $scope.switchit = $scope.switches[projectIndex];

    $scope.destroy = function() {
        $scope.switches.$remove($scope.switchit).then(function(data) {
            $location.path('/');
        });
    };

    $scope.save = function() {
        $scope.switches.$save($scope.switchit).then(function(data) {
           $location.path('/');
        });
    };
});

