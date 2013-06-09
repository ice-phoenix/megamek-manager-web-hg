angular.module('util.auth', ['mmm.rest.users',
                             'util.notifications'])

.factory('auth', ['$rootScope', '$location', '$http', 'notifications', 'Users',
         function( $rootScope,   $location,   $http,   notifications,   Users ) {

  var authService = {};
  var currentUser = null;

  authService.login = function(user) {
    currentUser = user;
  };

  authService.logout = function() {
    $http.post('/logout')
    .success(function(data, status, headers, config) {
      currentUser = null;
      notifications.addNext({type: 'success', msg: 'Logged out'});
      $location.path('/');
    })
    .error(function(data, status, headers, config) {
      notifications.addCurrent({type: 'error', msg: 'Logout failed'});
    });
  };

  authService.update = function() {
    Users.current(
      {},
      function(json) {
        var user = Users.transform(json);
        authService.login(user);
      },
      $rootScope.$restDefaultErrorHandler
    );
  };

  return authService;
}]);
