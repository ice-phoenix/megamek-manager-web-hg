angular.module('mmm', ['ui.bootstrap',
                       'mmm.serverlist',
                       'util.notifications'])

.config(['$routeProvider', "$dialogProvider", function($routeProvider, $dialogProvider) {

  $routeProvider
    .when('/', { redirectTo: '/servers' });

  $dialogProvider.options({});

}]);
