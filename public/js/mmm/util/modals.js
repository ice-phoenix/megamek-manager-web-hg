angular.module('util.modals', ['ui.bootstrap'])

.controller('ModalMessageBoxCtrl', ['$scope', 'dialog', 'model', function($scope, dialog, model) {

  $scope.title = model.title;
  $scope.msg = model.msg;
  $scope.warn = model.warn;
  $scope.buttons = model.buttons;

  $scope.close = function(result) {
    dialog.close(result);
  };

}])

.factory('modals', ['$dialog', function($dialog) {

  var modals = {};

  modals.confirm = function(title, msg, warn, buttons) {
    return $dialog.dialog({
        templateUrl: '/assets/templates/mmm/modal-message-box.tmpl',
        controller: 'ModalMessageBoxCtrl',
        resolve: {
          model: function() {
            return {
              title: title,
              msg: msg,
              warn: warn,
              buttons: buttons
            };
          }
        }
      });
  };

  return modals;

}]);
