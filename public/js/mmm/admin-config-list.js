angular.module('mmm.adminconfiglist', ['ui.bootstrap',
                                       'mmm.rest.admin.config',
                                       'util.auth',
                                       'util.collections',
                                       'util.directive.editonclick',
                                       'util.notifications'])

.config(['$routeProvider', 'authDeferProvider', function($routeProvider, authDeferProvider) {
  $routeProvider
    .when('/admin/config', {
      templateUrl: '/assets/templates/mmm/admin-config-list.tmpl',
      controller: 'AdminConfigListCtrl',
      resolve: {
        requiredRole: authDeferProvider.requiredRole('Admin')
      }
    });
}]) // 'config'

.controller('AdminConfigListCtrl', ['$scope', 'AdminConfig', 'collections', 'notifications',
                           function( $scope,   AdminConfig,   collections,   notifications ) {

  $scope.model = {};
  $scope.ctrl = {};

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  var $loadConfig = function() {
    AdminConfig.get(
      {},
      function(json) {
        $scope.model.config = AdminConfig.in(json);
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.ctrl.saveConfig = function() {
    AdminConfig.put(
      AdminConfig.out($scope.model.config),
      function(json) {
        var newConfig = AdminConfig.in(json);
        AdminConfig.merge($scope.model.config, newConfig);
      },
      function(error) {
        var changed = error.data.changed || {};
        var newConfig = AdminConfig.in(changed);
        AdminConfig.merge($scope.model.config, newConfig);
        $scope.$restDefaultErrorHandler(error);
      }
    );
  };

  /////////////////////////////////////////////////////////////////////////////
  // Editing
  /////////////////////////////////////////////////////////////////////////////

  var activeEdits = 0;
  $scope.model.isSaveConfigDisabled = false;

  var $update = function() {
    var isSaveConfigDisabled = activeEdits > 0;
    if (isSaveConfigDisabled !== $scope.model.isSaveConfigDisabled) {
      $scope.model.isSaveConfigDisabled = isSaveConfigDisabled;
    }
  };

  $scope.ctrl.onEditOn = function() {
    activeEdits = activeEdits + 1;
    $update();
  };

  $scope.ctrl.onEditOff = function() {
    activeEdits = activeEdits - 1;
    $update();
  };

  /////////////////////////////////////////////////////////////////////////////
  // Filtering
  /////////////////////////////////////////////////////////////////////////////

  $scope.ctrl.clearSearchId = function() {
    $scope.model.searchId = '';
  };

  /////////////////////////////////////////////////////////////////////////////
  // Init
  /////////////////////////////////////////////////////////////////////////////

  $loadConfig();

}]);
