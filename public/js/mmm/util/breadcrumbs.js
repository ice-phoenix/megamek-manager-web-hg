angular.module('util.breadcrumbs', [])

.controller('BreadcrumbsNavCtrl', ['$scope', 'breadcrumbs', function($scope, breadcrumbs) {
  $scope.breadcrumbs = breadcrumbs;

  $scope.getBreadcrumbCls = function(b) {
    var bs = breadcrumbs.getAll();
    if (b === bs[bs.length-1]) return 'active';
    else return '';
  };
}])

.factory('breadcrumbs', ['$rootScope', '$location', function($rootScope, $location) {

  var breadcrumbs = [];
  var breadcrumbsService = {};

  $rootScope.$on('$routeChangeSuccess', function(event, current) {
    var pathElements = $location.path().split('/');
    var res = [];

    var currentPath = '/#';
    angular.forEach(pathElements, function(e) {
      if (e === '') return;
      currentPath = currentPath + '/' + e;
      res.push({ name: e, path: currentPath });
    });

    breadcrumbs = res;
  });

  breadcrumbsService.getAll = function() {
    return breadcrumbs;
  };

  return breadcrumbsService;
}]);
