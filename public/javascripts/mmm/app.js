angular.module('mmm', [])
  .config(['$routeProvider', function($routeProvider) {
      $routeProvider
          .when('/', { templateUrl: '/assets/templates/server-list.tmpl', controller: ServerListCtrl })
}]);
