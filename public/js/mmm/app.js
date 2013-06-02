angular.module('mmm', ['ui.bootstrap',
                       'mmm.adminconfiglist',
                       'mmm.adminpanel',
                       'mmm.serverlist',
                       'mmm.welcome',
                       'util.breadcrumbs',
                       'util.notifications'])

.config(["$dialogProvider", function($dialogProvider) {

  $dialogProvider.options({});

}]);
