angular.module('util.directive.activeonrole', ['util.auth'])

.directive('activeOnRole', ['$parse', 'auth', function($parse, auth) {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    scope: true,
    link: function(scope, element, attrs) {
      var role = attrs.activeOnRole;

      var $update = function() {
        if (auth.hasRole(role)) {
          element.show();
          element.find('*').prop('disabled', false);
        } else {
          element.hide();
          element.find('*').prop('disabled', true);
        }
      };

      $update();
    }
  };
}]);
