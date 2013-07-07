angular.module('util.auth', ['mmm.rest.whoami',
                             'util.notifications'])

.controller('AuthNavCtrl', ['$scope', 'auth', function($scope, auth) {

  $scope.model = {};
  $scope.ctrl = {};

  $scope.ctrl.logout = function() {
    auth.logout();
  };

  var $update = function() {
    auth.isLoggedIn().then(function(result) {
      $scope.model.isLoggedIn = result;
    });
    auth.username().then(function(result) {
      $scope.model.username = result;
    });
  };

  $scope.$on('auth.userChanged', $update);

  $update();

}]) // 'controller'

.factory('auth', ['$rootScope', '$http', '$location', '$q', 'WhoAmI', 'notifications',
         function( $rootScope,   $http,   $location,   $q,   WhoAmI,   notifications ) {

  var authService = {};
  var currentUser = undefined;

  var $changeUser = function(newUser) {
    var oldUser = currentUser;

    if (oldUser !== newUser) {
      currentUser = newUser;
      $rootScope.$broadcast('auth.userChanged', oldUser, newUser);
    }
  };

  authService.login = function(user) {
    $changeUser(user);
  };

  authService.logout = function() {
    $http.post('/logout')
    .success(function(data, status, headers, config) {
      $changeUser(null);
    })
    .error(function(data, status, headers, config) {
      notifications.addCurrentMsg('error', 'Logout failed');
    });
  };

  var $update = function(callback, args) {
    var deferred = $q.defer();

    if (angular.isUndefined(currentUser)) {
      WhoAmI.get(
        {},
        function(json) {
          var user = WhoAmI.in(json);
          authService.login(user);
          deferred.resolve(callback.apply(null, args));
        },
        function(error) {
          deferred.reject(error.data.msg || 'Unknown error');
          $rootScope.$restDefaultErrorHandler(error);
        }
      );
    } else {
      deferred.resolve(callback.apply(null, args));
    }

    return deferred.promise;
  };

  var $isLoggedIn = function() {
    return !!currentUser;
  };
  authService.isLoggedIn = function() { return $update($isLoggedIn); };

  var $username = function() {
    if ($isLoggedIn()) {
      return currentUser.fullName;
    } else {
      return null;
    }
  };
  authService.username = function() { return $update($username); };

  var $hasRole = function(role) {
    if ($isLoggedIn()) {
      if (currentUser.roles.indexOf(role) > -1) {
        return true;
      }
    }
    return false;
  };
  authService.hasRole = function(role) { return $update($hasRole, [role])};

  return authService;

}]) // 'factory'

.provider('authDefer', {

  requiredRole: function(role) {
    return function(authDefer) {
      return authDefer.requiredRole(role);
    };
  },

  $get: ['auth', '$q', function(auth, $q) {
    var authDeferService = {};

    authDeferService.requiredRole = function(role) {
      var deferred = $q.defer();
      auth.hasRole(role).then(function(result) {
        if (result) deferred.resolve(true);
        else deferred.reject(['Required role:', role].join(' '));
      });
      return deferred.promise;
    };

    return authDeferService;
  }]

}); // 'provider'
