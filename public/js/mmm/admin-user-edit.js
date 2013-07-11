angular.module('mmm.adminuseredit', ['ui.bootstrap',
                                     'mmm.rest.roles',
                                     'mmm.rest.users',
                                     'util.auth',
                                     'util.collections',
                                     'util.modals',
                                     'util.notifications'])

.config(['$routeProvider', 'authDeferProvider', function($routeProvider, authDeferProvider) {
  $routeProvider
    .when('/admin/users/:id', {
      templateUrl: '/assets/templates/mmm/admin-user-edit.tmpl',
      controller: 'AdminUserEditCtrl',
      resolve: {
        requiredRole: authDeferProvider.requiredRole('Admin')
      }
    });
}]) // 'config'

.controller('AdminUserEditCtrl', ['$scope', '$routeParams', 'Roles', 'Users', 'collections', 'modals', 'notifications',
                         function( $scope,   $routeParams,   Roles,   Users,   collections,   modals,   notifications ) {

  $scope.model = {};
  $scope.ctrl = {};

  var userId = $routeParams.id;

  $scope.model.simpleFields = [
    {name: 'dbId',       readonly: true},
    {name: 'providerId', readonly: true},
    {name: 'firstName',  readonly: false},
    {name: 'lastName',   readonly: false},
    {name: 'email',      readonly: false},
    {name: 'avatarUrl',  readonly: false},
    {name: 'authType',   readonly: true}
  ];

  $scope.model.userRoles = collections.lut(function(r) { return r.dbId; });
  $scope.model.serverRoles = collections.lut(function(r) { return r.dbId; });

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  var $loadUser = function() {
    Users.get(
      {id: userId},
      function(json) {
        var user = Users.in(json);
        $scope.model.user = user;
        angular.forEach(user.roles, function(r) {
          $scope.model.userRoles.add(r);
        });
        $updateSelected();
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.ctrl.saveUser = function() {
    $scope.model.user.roles = $scope.model.userRoles.getAll();

    Users.put(
      {id: userId},
      Users.out($scope.model.user),
      function(json) {
        notifications.addCurrentMsg('success', 'User updated');
      },
      $scope.$restDefaultErrorHandler
    )
  };

  var $loadRoles = function() {
    Roles.query(
      {},
      function(json) {
        angular.forEach(Roles.in(json), function(r) {
          $scope.model.serverRoles.add(r);
        });
        $updateSelected();
      },
      $scope.$restDefaultErrorHandler
    )
  };

  /////////////////////////////////////////////////////////////////////////////
  // Editing
  /////////////////////////////////////////////////////////////////////////////

  var $updateSelected = function() {
    $scope.model.selectedUserRole = $scope.model.userRoles.head();
    $scope.model.selectedServerRole = $scope.model.serverRoles.head();
  };

  $scope.ctrl.addRole = function(role) {
    if (angular.isUndefined(role)) role = $scope.model.selectedServerRole;
    $scope.model.userRoles.add(role);
    $updateSelected();
  };

  $scope.ctrl.removeRole = function(role) {
    if (angular.isUndefined(role)) role = $scope.model.selectedUserRole;
    $scope.model.userRoles.remove(role.dbId);
    $updateSelected();
  };

  /////////////////////////////////////////////////////////////////////////////
  // Init
  /////////////////////////////////////////////////////////////////////////////

  $loadUser();
  $loadRoles();

}]); // 'controller'
