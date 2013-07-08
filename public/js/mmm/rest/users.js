angular.module('mmm.rest.users', ['ngResource',
                                  'util.restutils'])

.factory('Users', ['$resource', 'restUtils', function($resource, restUtils) {

  var Users = $resource(
    '/api/admin/users/:id'
  );

  var $in = function(user) {
    var res = angular.copy(user);
    res.rolesStr = res.roles.map(function(r) { return r.name; }).join(' / ');
    return res;
  };

  restUtils.attachInOut(Users, $in);

  return Users;

}]); // 'factory'
