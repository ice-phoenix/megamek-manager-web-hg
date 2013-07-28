angular.module('mmm', ['js.ext',
                       'ui.bootstrap',
                       'mmm.adminconfiglist',
                       'mmm.adminpanel',
                       'mmm.adminuseredit',
                       'mmm.adminuserlist',
                       'mmm.serverlist',
                       'mmm.welcome',
                       'util.auth',
                       'util.breadcrumbs',
                       'util.exceptionhandler',
                       'util.nav',
                       'util.notifications'])

.config(['$dialogProvider', function($dialogProvider) {

  $dialogProvider.options({});

}]) // 'config'

.run([   '$rootScope', '$location', 'auth', 'notifications',
function( $rootScope,   $location,   auth,   notifications ) {

  $rootScope.$restDefaultErrorHandler = function(error) {
    var msg = error.data.msg || 'Unknown error';
    notifications.addCurrentMsg('error', msg);
  };

  $rootScope.$on('$routeChangeError', function(event, current, previous, errMsg) {
    $location.path('/');
    notifications.addNextMsg('error', errMsg);
  });

}]); // 'run'
