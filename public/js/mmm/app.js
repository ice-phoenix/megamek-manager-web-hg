angular.module('mmm', ['ui.bootstrap',
                       'mmm.adminconfiglist',
                       'mmm.adminpanel',
                       'mmm.serverlist',
                       'mmm.welcome',
                       'util.auth',
                       'util.breadcrumbs',
                       'util.exceptionHandler',
                       'util.notifications'])

.config(['$dialogProvider',
function( $dialogProvider ) {

  $dialogProvider.options({});

}])

.run([   '$rootScope', '$location', 'auth', 'notifications',
function( $rootScope,   $location,   auth,   notifications ) {

  $rootScope.$restDefaultErrorHandler = function(error) {
    var msg = error.data.msg || 'Unknown error';
    notifications.addCurrent({type: 'error', msg: msg});
  };

  $rootScope.$on('$routeChangeError', function(event, current, previous, errMsg) {
    $location.path('/');
    notifications.addNext({type: 'error', msg: errMsg});
  });

  auth.update();

}]);
