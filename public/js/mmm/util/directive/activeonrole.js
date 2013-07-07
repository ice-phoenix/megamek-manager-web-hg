angular.module('util.directive.activeonrole', ['util.auth'])

.directive('activeOnRole', ['$parse', 'auth', function($parse, auth) {

  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    scope: true,
    link: function(scope, element, attrs) {

      var role = attrs.activeOnRole;

      var $enable = function() {
        element.show();
        element.find('*').prop('disabled', false);
      };

      var $disable = function() {
        element.hide();
        element.find('*').prop('disabled', true);
      };

      var $update = function() {
        auth.hasRole(role).then(function(result) {
          if (result) $enable();
          else $disable();
        });
      };

      scope.$on('auth.userChanged', $update);

      $update();
    }
  };

}]); // 'directive'
