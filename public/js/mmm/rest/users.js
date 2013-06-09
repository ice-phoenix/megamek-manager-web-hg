angular.module('mmm.rest.users', ['ngResource'])

.factory('Users', ['$resource', function($resource) {
  var Users = $resource(
    '/auth/users/:id',
    {},
    {
      'current': { method: 'GET', params: {id: 'current'}, isArray: false }
    }
  );

  var isNull = function(data) {
    return data[0] === 'n' &&
           data[1] === 'u' &&
           data[2] === 'l' &&
           data[3] === 'l';
  };

  Users._transform = function(srv) {
    if (isNull(srv)) return null;
    else return srv;
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
