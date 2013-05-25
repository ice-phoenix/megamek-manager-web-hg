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
        defaultErrorHandler(error);
      }
    );
  }

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

.directive('onKeyUp', ['$parse', function($parse) {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    scope: true,
    link: function(scope, element, attrs) {
      var callback = $parse(attrs.onKeyUp);
      element.bind('keyup', function(event) {
        scope.$apply(function() {
          callback(scope, {$event:event});
        });
      });
    }
  };
}])

.directive('editOnClick', ['$parse', '$timeout', function($parse, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: true,
    template: '<div>' +
                '<span ng-switch="model.isEditMode">' +
                  '<input type="text" class="input-compact" ng-switch-when="false" ng-model="model.editValue" readonly ng-click="enterEditMode($event)"></input>' +
                  '<input type="text" class="input-compact" ng-switch-when="true"  ng-model="model.editValue"          on-key-up="exitEditMode($event)"></input>' +
                '</span>' +
              '</div>',
    link: function(scope, element, attrs) {

      scope.model = {};

      scope.$valueGetter = $parse(attrs.value);
      scope.$valueSetter = scope.$valueGetter.assign;

      scope.getValue = function() {
        var value = scope.$valueGetter(scope);
        scope.model.undo = value;
        scope.model.editValue = value;
      };

      scope.setValue = function() {
        var newValue = scope.model.editValue;
        scope.model.undo = newValue;
        scope.$valueSetter(scope, newValue);
      };

      scope.revertValue = function() {
        scope.model.editValue = scope.model.undo;
      };

      scope.model.isEditMode = false;
      scope.getValue();

      scope.enterEditMode = function(event) {
        scope.model.isEditMode = true;
        scope.getValue();
        $timeout(function() { element.find('input').focus(); }, 0);
      };

      scope.exitEditMode = function(event) {
        switch (event.which) {
          case 13:
            scope.model.isEditMode = false;
            scope.setValue();
            break;
          case 27:
            scope.model.isEditMode = false;
            scope.revertValue();
            break;
        }
      };
    }
  }; // return
}]);
