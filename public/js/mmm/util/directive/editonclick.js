angular.module('util.directive.editonclick', ['util.directive.onkeyup'])

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

      var $onEditOnCallback = $parse(attrs.onEditOn);
      var $onEditOn = function() {
        $onEditOnCallback(scope);
      };
      var $onEditOffCallback = $parse(attrs.onEditOff);
      var $onEditOff = function() {
        $onEditOffCallback(scope);
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
