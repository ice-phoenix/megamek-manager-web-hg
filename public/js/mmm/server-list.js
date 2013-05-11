angular.module('mmm.serverlist', ['ui.bootstrap', 'mmm.rest.servers'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/servers', {
      templateUrl: '/assets/templates/server-list.tmpl',
      controller: 'ServerListCtrl'
    })
}])

.controller('ServerListCtrl', ['$scope', 'Servers', function($scope, Servers) {
  $scope.queryServers = function() {
    Servers.query({}, function(json) {
      $scope.servers = json.map(function(srv) {
        var res = {};
        res.port = srv.port;
        res.players = srv.players;
        res.status = srv.type === 'server-online' ? 'Online' :
                     srv.type === 'server-timed-out' ? 'Timed out' :
                     srv.type === 'server-failed' ? 'Failed' :
                     'Unknown';
        res.statusCls = srv.type === 'server-online' ? 'success' :
                        srv.type === 'server-timed-out' ? 'warning' :
                        'error';
        return res;
      });
    });
  };

  $scope.createServer = function(port) {
    mmmServer.put(
      {serverPort: port},
      function(json) {

      },
      function(error) {

      });
  };

  $scope.setSortBy = function(sortBy, sortByReversed) {
    $scope.sortByReversed = (sortBy === $scope.sortBy ? !$scope.sortByReversed : false);
    if (typeof sortBy !== 'undefined') $scope.sortBy = sortBy;
    if (typeof sortByReversed !== 'undefined') $scope.sortByReversed = sortByReversed;
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

  $scope.setSortBy('players.length', true);

  $scope.queryServers();
}]);
