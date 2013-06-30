angular.module('mmm.adminconfiglist', ['ui.bootstrap',
                                       'mmm.rest.admin.config',
                                       'util.directive.editonclick',
                                       'util.notifications',
                                       'util.modals',
                                       'util.collections'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/admin/config', {
      templateUrl: '/assets/templates/mmm/admin-config-list.tmpl',
      controller: 'AdminConfigListCtrl'
    })
}])

.controller('AdminConfigListCtrl', ['$scope', 'AdminConfig', 'notifications', 'modals', 'collections',
                           function( $scope,   AdminConfig,   notifications,   modals,   collections ) {

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  $scope.getConfig = function() {
    AdminConfig.get(
      {},
      function(json) {
        $scope.config = AdminConfig.transform(json);
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.saveConfig = function() {
    AdminConfig.put(
      AdminConfig.untransform($scope.config),
      function(json) {
        var newConfig = AdminConfig.transform(json);
        AdminConfig.merge($scope.config, newConfig);
      },
      function(error) {
        var changed = error.data.changed || {};
        var newConfig = AdminConfig.transform(changed);
        AdminConfig.merge($scope.config, newConfig);
        $scope.$restDefaultErrorHandler(error);
      }
    );
  }

  /////////////////////////////////////////////////////////////////////////////
  // Editing
  /////////////////////////////////////////////////////////////////////////////

  $scope.onEditOn = function() {
    $scope.activeEdits = $scope.activeEdits + 1;
  };

  $scope.onEditOff = function() {
    $scope.activeEdits = $scope.activeEdits - 1;
  };

  $scope.isSaveConfigDisabled = function() {
    return $scope.activeEdits > 0;
  };

  /////////////////////////////////////////////////////////////////////////////
  // Filtering
  /////////////////////////////////////////////////////////////////////////////

  $scope.clearSearchId = function() {
    $scope.searchId = '';
  };

  /////////////////////////////////////////////////////////////////////////////
  // Init
  /////////////////////////////////////////////////////////////////////////////

  $scope.activeEdits = 0;
  $scope.getConfig();
}]);
