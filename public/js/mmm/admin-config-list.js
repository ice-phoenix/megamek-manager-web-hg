angular.module('mmm.adminconfiglist', ['ui.bootstrap',
                                       'mmm.rest.admin.config',
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

  var defaultErrorHandler = function(error) {
    var msg = error.data.msg || 'Unknown error';
    notifications.addCurrent({type: 'error', msg: msg});
  };

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  $scope.getConfig = function() {
    AdminConfig.get(
      {},
      function(json) {
        $scope.config = AdminConfig.transform(json);
      },
      defaultErrorHandler
    );
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

  $scope.getConfig();
}]);
