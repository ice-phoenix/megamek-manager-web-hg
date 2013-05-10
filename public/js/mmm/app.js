angular.module('mmm', ['mmmServerServices'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: '/assets/templates/server-list.tmpl', controller: ServerListCtrl })
}]);
