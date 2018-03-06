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

.service('Modal', function($rootScope, $timeout, $sce) {
  /**
   *
   * @param options = {
   *   message: 'my message' // message to show
   *   delay: 3000           // delay in milliseconds before the modal hides (default 3000)
   * }
   */
  this.delayedHideModal = function(options) {
    $rootScope.mainModalMessage = $sce.trustAsHtml(options.message || 'NO MESSAGE SET');

    $('#main-modal-message').modal('show');

    $timeout(function() {
      $('#main-modal-message').modal('hide');
    },options.delay || 3000);
  };
})

.controller('ListCtrl', function($scope, $http, $location, Switches, Modal) {
  // console.log(Switches.rows)
  Switches.get().then(function(promise){
    $scope.switches = promise.data.rows;
    $scope.rows = chunk(promise.data.rows,3);
  });

  $scope.turnOn = function(switchit) {
    $http({method:"POST",data:{ids:switchit.idlist,state:'on'}, url:'/_nodejs'})
      .success(function(data, status) {
        if (status == 200) {
          Modal.delayedHideModal({message:switchit.doc.name + ' <strong>on</strong>'});
        }
      })
    ;
  };
  $scope.turnOff = function(switchit) {
    $http({method:"POST",data:{ids:switchit.idlist,state:'off'}, url:'/_nodejs'})
      .success(function(data, status) {
        if (status == 200) {
          Modal.delayedHideModal({message:switchit.doc.name + ' <strong>off</strong>'});
        }
      })
    ;
  };
  $scope.setMood = function(switchit) {
    $http({method:"POST",data:{ids:switchit.idlist_on,state:'on'}, url:'/_nodejs'});
    $http({method:"POST",data:{ids:switchit.idlist_off,state:'off'}, url:'/_nodejs'})
      .success(function(data, status) {
        if (status == 200) {
          Modal.delayedHideModal({message:switchit.doc.name + ' <strong>set</strong>'});
        }
      })
    ;
  };
  $scope.showEdit = function(switchit){
    doc = switchit.value.doc
    $location.path("/edit/"+doc._id);
  };
  $scope.showNew = function(){
    $location.path("/new");
  };
})
