angular.module('util.directive.onkeyup', [])

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
}]);
