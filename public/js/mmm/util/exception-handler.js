angular.module('util.exceptionhandler', ['util.notifications'])

.factory('exceptionHandler', ['$injector', function($injector) {
  return function(delegate) {
    return function(exception, cause) {
      var notifications = $injector.get('notifications');
      notifications.addCurrentMsg('error', exception.message);
      return delegate(exception, cause);
    };
  };
}]) // 'factory'

.config(['$provide', function($provide) {
  $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandler', function($delegate, exceptionHandler) {
    return exceptionHandler($delegate);
  }]);
}]); // 'config'
