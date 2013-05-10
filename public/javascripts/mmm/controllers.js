function ServerListCtrl($scope, mmmServer) {
  $scope.servers = mmmServer.query();

  $scope.setSortBy = function(sortBy, sortByReversed) {
    $scope.sortByReversed = (sortBy === $scope.sortBy ? !$scope.sortByReversed : false);
    if (typeof sortBy !== 'undefined') $scope.sortBy = sortBy;
    if (typeof sortByReversed !== 'undefined') $scope.sortByReversed = sortByReversed;
  }

  $scope.setSortBy('players.length', true);
}
