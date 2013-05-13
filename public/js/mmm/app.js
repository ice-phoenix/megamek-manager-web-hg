angular.module('mmm', ['ui.bootstrap', 'mmm.serverlist'])

.config(['$routeProvider', "$dialogProvider", function($routeProvider, $dialogProvider) {

  $routeProvider
    .when('/', { redirectTo: '/servers' });

  $dialogProvider.options({});

}]);
