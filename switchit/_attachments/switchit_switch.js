angular.module('switchit_switch', ['ngResource','CornerCouch','switchit_basic_switch'])

.factory('SwitchModels', function(){
  return {
      "kaku":"KlikAanKlikUit",
      "action":"Action",
      "elro":"Elro",
      "blokker":"Blokker"
    };
})

// .controller('CreateCtrl', function($scope, $location, Switches, SwitchModels, SwitchTypes) {
//   Switches.get({startkey:["switch"], endkey:["switch",[]]}).then(function(promise){
//     $scope.switches = promise.data.rows;
//   });
//   $scope.types = SwitchTypes;
//   $scope.models = SwitchModels;
//   $scope.switchit = Switches.getDB().newDoc({});

//   $scope.save = function() {
//       $scope.switchit.save().then(function(data) {
//           $location.path('/');
//       });
//   };
// })

.controller('EditCtrl',
  function($scope, $location, $routeParams, Switches, cornercouch, dgName, vwName, dbName, SwitchModels, SwitchTypes) {
    Switches.get({startkey:["switch"], endkey:["switch",[]]}).then(function(promise){
      $scope.switches = promise.data.rows;
    });

    $scope.types = SwitchTypes;
    $scope.models = SwitchModels;

    var switchId = $routeParams.switchId;
    if(switchId){
      $scope.switchit = Switches.getDB().getDoc(switchId);
      $scope.newSwitch = false;
    }
    else{
      $scope.switchit = Switches.getDB().newDoc({doctype:'switch'});
      $scope.newSwitch = true;
    }

    $scope.$watch('switchit.type', function() {
      if($scope.newSwitch){
        // reset on and off values.
        delete $scope.switchit.off;
        delete $scope.switchit.on;

        switch($scope.switchit.type){
          case 'switch':
            break;
          case 'mood':
            $scope.switchit.off = [];
            $scope.switchit.on = [];
            break;
          case 'group':
            $scope.switchit.on = [];
            break;
        }
      }
    })


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

    $scope.moodStatus = function(toCheck){
      if($scope.switchit.off.indexOf(toCheck.id) > -1)
        return "off";
      if($scope.switchit.on.indexOf(toCheck.id) > -1)
        return "on";
      if($scope.switchit.off.indexOf(toCheck.id) < 0 && $scope.switchit.on.indexOf(toCheck.id) < 0)
        return "neutral";
    }

    $scope.setMoodState = function(switchId, newState){
      var offIndex = $scope.switchit.off.indexOf(switchId)
      var onIndex = $scope.switchit.on.indexOf(switchId)
      switch(newState){
        case "on":
          // add to on if it is not yet there
          if(onIndex < 0){
            $scope.switchit.on.push(switchId)
          }
          // remove from off if it is there
          if(offIndex > -1){
            $scope.switchit.off.splice(offIndex,1)
          }
          break;

        case "off":
          // remove from on if it is there
          if(onIndex > -1){
            $scope.switchit.on.splice(onIndex, 1)
          }
          // add to off if it is not yet there
          if(offIndex < 0){
            $scope.switchit.off.push(switchId)
          }
          break;

        case "neutral":
          // remove from on and off.
          if(onIndex > -1){
            $scope.switchit.on.splice(onIndex, 1)
          }
          if(offIndex > -1){
            $scope.switchit.off.splice(offIndex,1)
          }
          break;
      }
    }

    $scope.editGroup = function(switchId){
      if(!$scope.inGroup(switchId)){
        $scope.switchit.on.push(switchId);
      } else {
        var index = $scope.switchit.on.indexOf(switchId)
        $scope.switchit.on.splice(index, 1);
      }

    }

    $scope.inGroup = function(switchId){
      return $scope.switchit.on.indexOf(switchId) > -1
    }
});

