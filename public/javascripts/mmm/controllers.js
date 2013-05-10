function ServerListCtrl($scope, $http) {
  $http.get("/mmm/servers/").success(function(json) {
    if (json.success) {
        $scope.servers = json.payload.stats;
    }
  })

  $scope.setSortBy = function(sortBy, sortByReversed) {
    $scope.sortByReversed = (sortBy === $scope.sortBy ? !$scope.sortByReversed : false);
    if (typeof sortBy !== "undefined") $scope.sortBy = sortBy;
    if (typeof sortByReversed !== "undefined") $scope.sortByReversed = sortByReversed;
  }

  $scope.setSortBy("players.length", true);
}
