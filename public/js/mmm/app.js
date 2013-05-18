angular.module('mmm', ['ui.bootstrap',
                       'mmm.adminpanel',
                       'mmm.serverlist',
                       'util.notifications'])

.config(['$routeProvider', "$dialogProvider", function($routeProvider, $dialogProvider) {

  $routeProvider
    .when('/', { redirectTo: '/servers' });

  $dialogProvider.options({});

}]);
