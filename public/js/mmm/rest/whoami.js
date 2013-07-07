angular.module('mmm.rest.whoami', ['ngResource',
                                   'util.restutils'])

.factory('WhoAmI', ['$resource', 'restUtils', function($resource, restUtils) {
  var WhoAmI = $resource(
    '/api/whoami'
  );

  var isNull = function(arr) {
    return angular.equals(arr, ['n', 'u', 'l', 'l']);
  };

  var $in = function(user) {
    if (isNull(user)) return null;
    else return user;
  };

  restUtils.attachInOut(WhoAmI, $in);

  return WhoAmI;

}]); // 'factory'
