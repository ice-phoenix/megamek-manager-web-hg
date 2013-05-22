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
  // Editing
  /////////////////////////////////////////////////////////////////////////////

  $scope.getConfigValue = function(key) {
    return $scope.config[key].value;
  };

  $scope.setConfigValue = function(key, value) {
    $scope.config[key].value = value;
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
}])

.directive('editOnClick', ['$timeout', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: {
      get: '&',
      set: '&'
    },
    template: '<div>' +
                '<span ng-switch="isEditMode">' +
                  '<input type="text" class="input-compact" ng-switch-when="false" ng-model="editValue" readonly ng-click="enterEditMode()"></input>' +
                  '<input type="text" class="input-compact" ng-switch-when="true"  ng-model="editValue"                                    ></input>' +
                '</span>' +
              '</div>',
    link: function(scope, element, attrs) {

      scope.isEditMode = false;
      scope.editValue = scope.get();

      scope.dom = element;

      scope.enterEditMode = function() {
        scope.isEditMode = true;
        $timeout(function() { scope.dom.find('input').focus(); }, 0);
      };
    }
  }; // return
}]);
