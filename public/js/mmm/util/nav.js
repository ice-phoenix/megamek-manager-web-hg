angular.module('util.nav', [])

.controller('NavMenuCtrl', ['$scope', function($scope) {

  $scope.model = {};
  $scope.ctrl = {};

  $scope.ctrl.showAdmin = function() {
    $scope.model.adminIsCollapsed = false;
  };

  $scope.ctrl.hideAdmin = function() {
    $scope.model.adminIsCollapsed = true;
  };

  $scope.ctrl.hideAdmin();

}]) // 'controller'
