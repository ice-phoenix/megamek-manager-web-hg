angular.module('mmm.rest.users', ['ngResource'])

.factory('Users', ['$resource', function($resource) {
  var Users = $resource(
    '/api/users/:id'
  );

  Users._transform = function(srv) {
    return srv;
  };

  Users.transform = function(json) {
    if (angular.isArray(json)) {
      return json.map(Users._transform);
    } else {
      return Users._transform(json);
    }
  };

  return Users;
}]);
