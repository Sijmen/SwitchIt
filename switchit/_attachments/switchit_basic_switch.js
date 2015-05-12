angular.module('switchit_basic_switch', ['CornerCouch'])
.value('dbName', 'switchit')
.value('vwName', 'switches')
.value('dgName', 'switchit')

.factory('Switches',function(cornercouch,dbName,vwName, dgName){
  return  { get: function(qparams){
              var server = cornercouch();
              var db = server.getDB(dbName);
              return db.query(dgName, vwName, qparams);
            },
            getDB : function(){
              var server = cornercouch();
              return server.getDB(dbName);
            }
          };
  // return [{"name":"Test","id":"testid",'description':"test description"}];
})

.controller('RefreshListCtrl', function($scope, $location, Switches){
    $location.path('/');
})

.service('SwitchTypes', function(){
  return {
    "switch":"Switch",
    "group":"Group",
    "mood":"Mood"
  }
})

.controller('ListCtrl', function($scope, $http, $location, Switches) {
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
  $scope.setMood = function(switchit) {
    $http({method:"POST",data:{ids:switchit.idlist_on,state:'on'}, url:'/_nodejs'});
    $http({method:"POST",data:{ids:switchit.idlist_off,state:'off'}, url:'/_nodejs'});
  };
  $scope.showEdit = function(switchit){
    doc = switchit.value.doc
    $location.path("/edit/"+doc._id);
  };
  $scope.showNew = function(){
    $location.path("/new");
  };
})
