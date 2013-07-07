angular.module('util.directive.onkeyup', [])

.directive('onKeyUp', ['$parse', function($parse) {

  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    scope: true,
    link: function(scope, element, attrs) {
      var $parent = scope.$parent;
      var $onKeyUpCallback = $parse(attrs.onKeyUp);
      element.bind('keyup', function(event) {
        scope.$apply(function() {
          $onKeyUpCallback($parent, {$event:event});
        });
      });
    }
  };

}]); // 'directive'
