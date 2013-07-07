angular.module('util.directive.editonclick', ['util.directive.onkeyup'])

.directive('editOnClick', ['$parse', '$timeout', function($parse, $timeout) {

  return {
    restrict: 'E',
    replace: true,
    transclude: false,
    scope: true,
    template: '<div>' +
                '<span ng-switch="model.isEditMode">' +
                  '<input type="text" class="input-compact" ng-switch-when="false" ng-model="model.editValue" readonly ng-click="ctrl.enterEditMode($event)"></input>' +
                  '<input type="text" class="input-compact" ng-switch-when="true"  ng-model="model.editValue"          on-key-up="ctrl.exitEditMode($event)"></input>' +
                '</span>' +
              '</div>',

    link: function(scope, element, attrs) {

      var $parent = scope.$parent;

      scope.model = {};
      scope.ctrl = {};

      // Callbacks to our user
      var $valueGetter = $parse(attrs.value);
      var $valueSetter = $valueGetter.assign || angular.noop;

      var $onEditOnCallback = $parse(attrs.onEditOn);
      var $onEditOn = function() { $onEditOnCallback($parent); };
      var $onEditOffCallback = $parse(attrs.onEditOff);
      var $onEditOff = function() { $onEditOffCallback($parent); };

      // Helper functions
      var loadValue = function() {
        var value = $valueGetter($parent);
        scope.model.undo = value;
        scope.model.editValue = value;
      };
      var saveValue = function() {
        var newValue = scope.model.editValue;
        scope.model.undo = newValue;
        $valueSetter($parent, newValue);
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
      scope.ctrl.enterEditMode = function(event) {
        editOn();
        loadValue();
        $timeout(function() { element.find('input').focus(); }, 0);
      };

      scope.ctrl.exitEditMode = function(event) {
        switch (event.which) {
          case 13: // Enter
            editOff();
            saveValue();
            break;
          case 27: // ESC
            editOff();
            revertValue();
            break;
        }
      };

      // Init data model
      scope.model.isEditMode = false;
      loadValue();

    } // link

  }; // return

}]); // 'directive'
