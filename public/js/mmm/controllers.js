function ServerListCtrl($scope, mmmServer) {
  mmmServer.query({}, function(json) {
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
}
