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

.run([   '$rootScope', 'auth', 'notifications',
function( $rootScope,   auth,   notifications ) {

  $rootScope.$restDefaultErrorHandler = function(error) {
    var msg = error.data.msg || 'Unknown error';
    notifications.addCurrent({type: 'error', msg: msg});
  };

  auth.update();

}]);
