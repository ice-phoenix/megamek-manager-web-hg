angular.module('mmm.serverlist', ['ui.bootstrap', 'mmm.rest.servers', 'mmm.notificationlist', 'util.notifications'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/servers', {
      templateUrl: '/assets/templates/mmm/server-list.tmpl',
      controller: 'ServerListCtrl'
    })
}])

.controller('ServerListCtrl', ['$scope', 'Servers', 'notifications', function($scope, Servers, notifications) {
  $scope.notifications = notifications;

  $scope.queryServers = function() {
    Servers.query({}, function(json) {
      $scope.servers = Servers.transform(json);
    });
  };

  $scope.startServer = function(port) {
    if (angular.isUndefined(port)) port = $scope.startServerPort;
    Servers.put(
      {port: port},
      function(json) {
        $scope.servers.push(Servers.transform(json));
      },
      function(error) {
        var msg = error.data.msg || 'Unknown error';
        notifications.addCurrent({type: 'error', msg: msg});
      });
  };

  $scope.setSortBy = function(sortBy, sortByReversed) {
    $scope.sortByReversed = (sortBy === $scope.sortBy ? !$scope.sortByReversed : false);
    if (angular.isDefined(sortBy)) $scope.sortBy = sortBy;
    if (angular.isDefined(sortByReversed)) $scope.sortByReversed = sortByReversed;
  }

  $scope.getSortByCls = function(sortBy) {
    if (sortBy === $scope.sortBy) {
      if ($scope.sortByReversed) {
        return "icon-arrow-up";
      } else {
        return "icon-arrow-down";
      }
    } else {
      return "icon-";
    }
  }

  $scope.startServerPort = 2345;
  $scope.sortBy = 'players.length';
  $scope.sortByReversed = true;

  $scope.queryServers();
}]);
