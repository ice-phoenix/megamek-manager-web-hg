angular.module('mmm', ['ui.bootstrap',
                       'util.auth',
                       'util.breadcrumbs',
                       'util.notifications'])

.run([   'auth',
function( auth ) {

  auth.update();

}]);
