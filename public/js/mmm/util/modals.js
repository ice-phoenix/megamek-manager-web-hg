angular.module('util.modals', ['ui.bootstrap'])

.controller('ModalMessageBoxCtrl', ['$scope', 'dialog', 'model', function($scope, dialog, model) {

  $scope.title = model.title;
  $scope.msg = model.msg;
  $scope.warn = model.warn;
  $scope.buttons = model.buttons;

  $scope.close = function(result) {
    dialog.close(result);
  };

}]);
