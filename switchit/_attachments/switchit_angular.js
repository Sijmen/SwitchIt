angular.module('switchit_angular', ['ngRoute', 'switchit_switch'])
.config(function($routeProvider, $httpProvider) {
  $httpProvider.defaults.headers.common['Accept'] = 'text/html';
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
      controller: 'EditCtrl',
      templateUrl: 'buttons/edit.html'
    })
    .when('/refresh',{
      controller:'RefreshListCtrl',
      templateUrl:'loadingPage.html'
    })
    .otherwise({
      redirectTo:'/'
    });
});