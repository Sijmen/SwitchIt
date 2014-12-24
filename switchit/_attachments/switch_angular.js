angular.module('switch_angular', ['ngRoute','ngResource','CornerCouch'])

.value('dbName', 'switchit')
.value('vwName', 'switches')
.value('dgName', 'switchit')

.factory('Switches',function(cornercouch,dbName,vwName, dgName){
  return  { get: function(){
              console.log("Getting swich info!");
              var server = cornercouch();
              var db = server.getDB(dbName);
              return db.query(dgName, vwName);
            },
            getDB : function(){
              var server = cornercouch();
              return server.getDB(dbName);
            }
          };
  // return [{"name":"Test","id":"testid",'description':"test description"}];
})

.factory('SwitchModels', function(){
  return {
      "kaku":"KlikAanKlikUit",
      "action":"Action",
      "elro":"Elro",
      "blokker":"Blokker"
    };
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'ListCtrl',
      templateUrl:'buttons/list.html'
    })
    .when('/edit/:switchId', {
      controller:'EditCtrl',
      templateUrl:'buttons/edit.html'
    })
    .when('/new', {
      controller:'CreateCtrl',
      templateUrl:'buttons/edit.html'
    })
    .when('/refresh',{
      controller:'RefreshListCtrl',
      templateUrl:'loadingPage.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})
.controller('RefreshListCtrl', function($scope, $location, Switches){
    $location.path('/');
})
.controller('ListCtrl', function($scope, $http, Switches) {
  // console.log(Switches.rows)
  Switches.get().then(function(promise){
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

.controller('CreateCtrl', function($scope, $location, Switches, SwitchModels) {
  $scope.models = SwitchModels;
  // temp fix!! FIX?? Default type is always switch. But would be nicer to create
  // a model for it.
  defaults = {
    "doctype":"switch"
  }
  $scope.switchit = Switches.getDB().newDoc(defaults);

  $scope.save = function() {
      $scope.switchit.save().then(function(data) {
          $location.path('/');
      });
  };
})

.controller('EditCtrl',
  function($scope, $location, $routeParams, cornercouch, dgName, vwName, dbName, SwitchModels) {
    var switchId = $routeParams.switchId;
    server = cornercouch();
    db = server.getDB(dbName);
    $scope.switchit = db.getDoc(switchId);
    $scope.models = SwitchModels;

    $scope.destroy = function() {
        $scope.switchit.remove().then(function(data) {
            $location.path('/refresh');
        });
    };

    $scope.save = function() {
        $scope.switchit.save().then(function(data) {
           $location.path('/refresh');
        });
    };
});

