angular.module('util.notifications', [])

.factory('notifications', ['$rootScope', function ($rootScope) {

  var notifications = {
    'STICKY': [],
    'CURRENT': [],
    'NEXT': []
  };

  var notificationService = {};

  var addNotification = function(notifications, what) {
    if (!angular.isObject(what)) throw new Error('Notifications must be objects');
    notifications.push(what);
    return what;
  };

  $rootScope.$on('$routeChangeSuccess', function() {
    notifications.CURRENT.length = 0;
    notifications.CURRENT = angular.copy(notifications.NEXT);
    notifications.NEXT.length = 0;
  });

  notificationService.get = function() {
    return [].concat(notifications.STICKY, notifications.CURRENT);
  };

  notificationService.addSticky = function(notification) {
    return addNotification(notifications.STICKY, notification);
  };

  notificationService.addCurrent = function(notification) {
    return addNotification(notifications.CURRENT, notification);
  };

  notificationService.addNext = function(notification) {
    return addNotification(notifications.NEXT, notification);
  };

  notificationService.remove = function(notification) {
    angular.forEach(notifications, function(notificationsByType) {
      var idx = notificationsByType.indexOf(notification);
      if (idx > -1) notificationsByType.splice(idx, 1);
    });
  };

  notificationService.clear = function() {
    angular.forEach(notifications, function(notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  return notificationService;
}]);
