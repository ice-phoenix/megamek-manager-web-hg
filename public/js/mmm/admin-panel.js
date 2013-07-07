angular.module('mmm.adminpanel', ['ui.bootstrap',
                                  'util.auth'])

.config(['$routeProvider', 'authDeferProvider', function($routeProvider, authDeferProvider) {
  $routeProvider
    .when('/admin', {
      templateUrl: '/assets/templates/mmm/admin-panel.tmpl',
      resolve: {
        requiredRole: authDeferProvider.requiredRole('Admin')
      }
    });
}]); // 'config'
