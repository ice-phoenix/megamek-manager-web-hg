angular.module('mmm.adminuseredit', ['ui.bootstrap',
                                     'mmm.rest.users',
                                     'util.auth',
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

.controller('AdminUserEditCtrl', ['$scope', '$routeParams', 'Users', 'modals', 'notifications',
                         function( $scope,   $routeParams,   Users,   modals,   notifications ) {

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

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  var $loadUser = function() {
    Users.get(
      {id: userId},
      function(json) {
        $scope.model.user = Users.in(json);
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.ctrl.saveUser = function() {
    Users.put(
      {id: userId},
      Users.out($scope.model.user),
      function(json) {
        notifications.addCurrentMsg('success', 'User updated');
      },
      $scope.$restDefaultErrorHandler
    )
  };

  /////////////////////////////////////////////////////////////////////////////
  // Init
  /////////////////////////////////////////////////////////////////////////////

  $loadUser();

}]); // 'controller'
