angular.module('util.modals', ['ui.bootstrap'])

.controller('ModalMessageBoxCtrl', ['$scope', 'dialog', 'model', function($scope, dialog, model) {

  $scope.model = model;
  $scope.ctrl = {};

  $scope.ctrl.close = function(result) {
    dialog.close(result);
  };

}]) // 'controller'

.factory('modals', ['$dialog', function($dialog) {

  var modals = {};

  modals.confirm = function(title, msg, warn, buttons) {
    return $dialog.dialog({
      templateUrl: '/assets/templates/mmm/util/modal-message-box.tmpl',
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

}]); // 'factory'
