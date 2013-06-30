angular.module('util.exceptionHandler', ['util.notifications'])

.factory('exceptionHandler', ['$injector', function($injector) {
  return function($delegate) {

    return function(exception, cause) {
      var notifications = $injector.get('notifications');
      $delegate(exception, cause);
      notifications.addCurrent({type: 'error', msg: exception.message});
    };

  };
}])

.config(['$provide', function($provide) {
  $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandler', function ($delegate, exceptionHandler) {
    return exceptionHandler($delegate);
  }]);
}]);
