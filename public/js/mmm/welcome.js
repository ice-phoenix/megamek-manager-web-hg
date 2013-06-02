angular.module('mmm.welcome', [])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider
    .when('/',
          { templateUrl: '/assets/templates/mmm/welcome.tmpl' });

}]);
