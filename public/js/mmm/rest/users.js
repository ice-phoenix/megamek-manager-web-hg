angular.module('mmm.rest.users', ['ngResource',
                                  'util.restutils'])

.factory('Users', ['$resource', 'restUtils', function($resource, restUtils) {

  var Users = $resource(
    '/api/admin/users/:id',
    {},
    {
      'put': { method: 'PUT', params: {id: '@id'} }
    }
  );

  var $in = function(user) {
    var res = angular.copy(user);
    res.rolesStr = res.roles.map(function(r) { return r.name; }).join(' / ');
    return res;
  };

  var $out = function(user) {
    var res = angular.copy(user);
    delete res.rolesStr;
    return res;
  };

  restUtils.attachInOut(Users, $in, $out);

  return Users;

}]); // 'factory'
