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

      // Callbacks to our user
      var $valueGetter = $parse(attrs.value);
      var $valueSetter = $valueGetter.assign || angular.noop;

      var onEditOnCallback = $parse(attrs.onEditOn);
      var $onEditOn = function() {
        onEditOnCallback(scope);
      };
      var onEditOffCallback = $parse(attrs.onEditOff);
      var $onEditOff = function() {
        onEditOffCallback(scope);
      };

      // Helper functions
      var getValue = function() {
        var value = $valueGetter(scope);
        scope.model.undo = value;
        scope.model.editValue = value;
      };
      var setValue = function() {
        var newValue = scope.model.editValue;
        scope.model.undo = newValue;
        $valueSetter(scope, newValue);
      };
      var revertValue = function() {
        scope.model.editValue = scope.model.undo;
      };

      var editOn = function() {
        scope.model.isEditMode = true;
        $onEditOn();
      };
      var editOff = function() {
        scope.model.isEditMode = false;
        $onEditOff();
      };

      // Controller functions
      scope.enterEditMode = function(event) {
        editOn();
        getValue();
        $timeout(function() { element.find('input').focus(); }, 0);
      };

      scope.exitEditMode = function(event) {
        switch (event.which) {
          case 13:
            editOff();
            setValue();
            break;
          case 27:
            editOff();
            revertValue();
            break;
        }
      };

      // Init
      scope.model.isEditMode = false;
      getValue();
    }
  }; // return
}]);
