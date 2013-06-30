angular.module('mmm', ['ui.bootstrap',
                       'util.auth',
                       'util.breadcrumbs',
                       'util.exceptionHandler',
                       'util.notifications'])

.run([   'auth',
function( auth ) {

  auth.update();

}]);
