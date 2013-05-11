function ServerListCtrl($scope, mmmServer) {
  $scope.servers = mmmServer.query();

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
