angular.module('mmm.rest.whoami', ['ngResource'])

.factory('WhoAmI', ['$resource', function($resource) {
  var WhoAmI = $resource(
    '/api/whoami'
  );

  var isNull = function(arr) {
    return angular.equals(arr, ['n', 'u', 'l', 'l']);
  };

  WhoAmI._transform = function(srv) {
    if (isNull(srv)) return null;
    else return srv;
  };

  WhoAmI.transform = function(json) {
    if (angular.isArray(json)) {
      return json.map(WhoAmI._transform);
    } else {
      return WhoAmI._transform(json);
    }
  };

  return WhoAmI;
}]);
