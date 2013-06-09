angular.module('mmm', ['ui.bootstrap',
                       'mmm.adminconfiglist',
                       'mmm.adminpanel',
                       'mmm.serverlist',
                       'mmm.welcome',
                       'util.breadcrumbs',
                       'util.notifications'])

.config(['$dialogProvider',
function( $dialogProvider ) {

  $dialogProvider.options({});

}])

.run([   '$rootScope', 'notifications',
function( $rootScope,   notifications ) {

  $rootScope.$restDefaultErrorHandler = function(error) {
    var msg = error.data.msg || 'Unknown error';
    notifications.addCurrent({type: 'error', msg: msg});
  };

}]);
