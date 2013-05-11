angular.module('mmm.notificationlist', ['ui.bootstrap', 'util.notifications'])

.controller('NotificationListCtrl', ['$scope', 'notifications', function($scope, notifications) {
  $scope.notifications = notifications;

  $scope.getNotificationCls = function(what) {
    return 'alert alert-' + what.type;
  };
}]);
