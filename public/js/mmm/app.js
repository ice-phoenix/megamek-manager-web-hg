angular.module('mmm', ['ui.bootstrap',
                       'mmm.adminconfiglist',
                       'mmm.adminpanel',
                       'mmm.serverlist',
                       'util.breadcrumbs',
                       'util.notifications'])

.config(['$routeProvider', "$dialogProvider", function($routeProvider, $dialogProvider) {

  $routeProvider
    .when('/',
          { templateUrl: '/assets/templates/mmm/welcome.tmpl' });

  var forwardUrl = function(url) {
    $routeProvider.when(url, { templateUrl: url });
  };

  forwardUrl('/login');
  forwardUrl('/logout');
  forwardUrl('/signup');
  forwardUrl('/reset');
  forwardUrl('/password');

  var forwardUrlWithToken = function(url) {
    $routeProvider.when(
      url + "/:token",
      {
        controller: function($scope, $routeParams) {
          $scope.forwardedTemplateUrl = url + "/" + $routeParams['token'];
        },
        template: '<div ng-include src="forwardedTemplateUrl"></div>'
      }
    );
  }

  forwardUrlWithToken('/signup');
  forwardUrlWithToken('/reset');

  $dialogProvider.options({});

}]);
