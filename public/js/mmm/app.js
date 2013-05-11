angular.module('mmm', ['ui.bootstrap', 'mmm.ServerServices'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: '/assets/templates/server-list.tmpl', controller: ServerListCtrl })
}]);
