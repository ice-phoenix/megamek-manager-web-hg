angular.module('util.auth', ['mmm.rest.whoami',
                             'util.notifications'])

.controller('AuthNavCtrl', ['$scope', 'auth', function($scope, auth) {
  $scope.logout = function() {
    auth.logout();
  };

  $scope.isLoggedIn = auth.isLoggedIn();
  $scope.username = auth.username();

  $scope.$on('auth.userChanged', function(event, oldUser, newUser) {
    $scope.isLoggedIn = auth.isLoggedIn();
    $scope.username = auth.username();
  });
}])

.factory('auth', ['$rootScope', '$location', '$http', 'notifications', 'WhoAmI',
         function( $rootScope,   $location,   $http,   notifications,   WhoAmI ) {

  var authService = {};
  var currentUser = null;

  authService.changeUser = function(user) {
    var oldUser = currentUser;
    var newUser = user;

    if (oldUser !== newUser) {
      currentUser = user;
      $rootScope.$broadcast('auth.userChanged', oldUser, newUser);
    }
  };

  authService.login = function(user) {
    authService.changeUser(user);
  };

  authService.logout = function() {
    $http.post('/logout')
    .success(function(data, status, headers, config) {
      authService.changeUser(null);
    })
    .error(function(data, status, headers, config) {
      notifications.addCurrent({type: 'error', msg: 'Logout failed'});
    });
  };

  authService.update = function() {
    WhoAmI.get(
      {},
      function(json) {
        var user = WhoAmI.transform(json);
        authService.login(user);
      },
      $rootScope.$restDefaultErrorHandler
    );
  };

  authService.isLoggedIn = function() {
    return !!currentUser;
  };

  authService.username = function() {
    if (authService.isLoggedIn()) {
      return currentUser.firstName + " " + currentUser.lastName;
    } else {
      return null;
    }
  }

  return authService;
}]);
