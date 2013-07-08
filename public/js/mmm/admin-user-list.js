angular.module('mmm.adminuserlist', ['ui.bootstrap',
                                     'mmm.rest.users',
                                     'util.auth',
                                     'util.collections',
                                     'util.modals',
                                     'util.notifications'])

.config(['$routeProvider', 'authDeferProvider', function($routeProvider, authDeferProvider) {
  $routeProvider
    .when('/admin/users', {
      templateUrl: '/assets/templates/mmm/admin-user-list.tmpl',
      controller: 'AdminUserListCtrl',
      resolve: {
        requiredRole: authDeferProvider.requiredRole('Admin')
      }
    });
}]) // 'config'

.controller('AdminUserListCtrl', ['$scope', 'Users', 'collections', 'modals', 'notifications',
                         function( $scope,   Users,   collections,   modals,   notifications ) {

  $scope.model = {};
  $scope.ctrl = {};

  $scope.model.users = collections.lut(function(e) { return e.dbId; });

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  var $loadUsers = function() {
    Users.query(
      {},
      function(json) {
        $scope.model.users.clear();
        angular.forEach(Users.in(json), function(e) {
          $scope.model.users.add(e);
        });
      },
      $scope.$restDefaultErrorHandler
    );
  };

  /////////////////////////////////////////////////////////////////////////////
  // Sorting
  /////////////////////////////////////////////////////////////////////////////

  $scope.ctrl.toggleSortBy = function(sortBy) {
    if (sortBy !== $scope.model.sortBy) {
      $scope.model.sortByReversed = false;
      $scope.model.sortBy = sortBy;
    } else {
      $scope.model.sortByReversed = !$scope.model.sortByReversed;
    }
  };

  $scope.ctrl.getSortByCls = function(sortBy) {
    if (sortBy === $scope.model.sortBy) {
      if ($scope.model.sortByReversed) {
        return 'icon-arrow-up';
      } else {
        return 'icon-arrow-down';
      }
    } else {
      return "icon-";
    }
  };

  $scope.ctrl.getSortByKey = function(id) {
    var e = $scope.model.users.get(id);
    return e[$scope.model.sortBy];
  };

  /////////////////////////////////////////////////////////////////////////////
  // Init
  /////////////////////////////////////////////////////////////////////////////

  $scope.model.sortBy = 'dbId';
  $scope.model.sortByReversed = false;

  $loadUsers();

}]); // 'controller'
