angular.module('mmm', ['ui.bootstrap',
                       'mmm.adminpanel',
                       'mmm.serverlist',
                       'util.notifications'])

.config(['$routeProvider', "$dialogProvider", function($routeProvider, $dialogProvider) {

  $routeProvider
    .when('/', {
      templateUrl: '/assets/templates/mmm/welcome.tmpl'
    });

  $dialogProvider.options({});

}]);
