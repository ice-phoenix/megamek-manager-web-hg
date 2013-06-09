angular.module('mmm.adminpanel', ['ui.bootstrap',
                                  'util.notifications',
                                  'util.modals',
                                  'util.collections'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/admin', {
      templateUrl: '/assets/templates/mmm/admin-panel.tmpl',
      controller: 'AdminPanelCtrl'
    })
}])

.controller('AdminPanelCtrl', ['$scope', 'notifications', 'modals', 'collections',
                      function( $scope,   notifications,   modals,   collections ) {
  // EMPTY
}]);
