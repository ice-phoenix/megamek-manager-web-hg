angular.module('mmm.serverlist', ['ui.bootstrap',
                                  'mmm.rest.servers',
                                  'mmm.notificationlist',
                                  'util.notifications',
                                  'util.collections'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/servers', {
      templateUrl: '/assets/templates/mmm/server-list.tmpl',
      controller: 'ServerListCtrl'
    })
}])

.controller('ServerListCtrl', ['$scope', 'Servers', 'notifications', 'collections',
                      function( $scope,   Servers,   notifications,   collections ) {

  $scope.notifications = notifications;

  $scope.servers = collections.lut(function(e) { return e.port; });

  var defaultErrorHandler = function(error) {
    var msg = error.data.msg || 'Unknown error';
    notifications.addCurrent({type: 'error', msg: msg});
  };

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  $scope.queryServers = function() {
    Servers.query(
      {},
      function(json) {
        $scope.servers.clear();
        angular.forEach(Servers.transform(json), function(e) {
          $scope.servers.add(e);
        });
      },
      defaultErrorHandler
    );
  };

  $scope.startServer = function(port) {
    if (angular.isUndefined(port)) port = $scope.startServerPort;
    Servers.put(
      {port: port},
      function(json) {
        $scope.servers.add(Servers.transform(json));
        notifications.addCurrent({type: 'success', msg: ['Started server on port', port].join(' ')});
      },
      defaultErrorHandler
    );
  };

  $scope.stopServer = function(port) {
    Servers.remove(
      {port: port},
      function(json) {
        $scope.servers.remove(port);
        notifications.addCurrent({type: 'success', msg: ['Stopped server on port', port].join(' ')});
      },
      defaultErrorHandler
    );
  }

  $scope.toggleSortBy = function(sortBy) {
    $scope.sortByReversed = (sortBy === $scope.sortBy ? !$scope.sortByReversed : false);
    $scope.sortBy = sortBy;
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

  $scope.getSortByKey = function(id) {
    var e = $scope.servers.get(id);
    switch ($scope.sortBy) {
      case 'port': return e.port;
      case 'players': return e.players.length;
      case 'status': return e.status;
      default: return 0;
    }
  };

  $scope.startServerPort = 2345;
  $scope.sortBy = 'players';
  $scope.sortByReversed = true;

  $scope.queryServers();
}]);
