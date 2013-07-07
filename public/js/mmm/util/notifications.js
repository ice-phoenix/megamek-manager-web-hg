angular.module('util.notifications', [])

.controller('NotificationListCtrl', ['$scope', 'notifications', function($scope, notifications) {

  $scope.model = {};
  $scope.ctrl = {};

  $scope.model.notifications = notifications;

  $scope.ctrl.getNotificationCls = function(what) {
    return 'alert alert-compact alert-' + what.type;
  };

}]) // 'controller'

.factory('notifications', ['$rootScope', function($rootScope) {

  var notifications = {
    'STICKY': [],
    'CURRENT': [],
    'NEXT': []
  };

  var notificationService = {};

  var addNotification = function(notifications, what) {
    notifications.push(what);
  };

  $rootScope.$on('$routeChangeSuccess', function() {
    notifications.CURRENT.length = 0;
    notifications.CURRENT = angular.copy(notifications.NEXT);
    notifications.NEXT.length = 0;
  });

  notificationService.get = function() {
    return [].concat(notifications.STICKY, notifications.CURRENT);
  };

  notificationService.addStickyMsg = function(type, msg) {
    var n = { type: type, msg: msg };
    addNotification(notifications.STICKY, n);
  };

  notificationService.addCurrentMsg = function(type, msg) {
    var n = { type: type, msg: msg };
    addNotification(notifications.CURRENT, n);
  };

  notificationService.addNextMsg = function(type, msg) {
    var n = { type: type, msg: msg };
    addNotification(notifications.NEXT, n);
  };

  notificationService.remove = function(notification) {
    angular.forEach(notifications, function(notificationsByType) {
      var idx = notificationsByType.indexOf(notification);
      if (idx > -1) notificationsByType.splice(idx, 1);
    });
  };

  notificationService.clear = function() {
    angular.forEach([notifications.STICKY, notifications.CURRENT], function(notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  notificationService.clearAll = function() {
    angular.forEach(notifications, function(notificationsByType) {
      notificationsByType.length = 0;
    });
  };

  return notificationService;

}]); // 'factory'
