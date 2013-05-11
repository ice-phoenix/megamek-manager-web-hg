angular.module('mmm', ['mmm.serverlist'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { redirectTo: '/servers' })
}]);
