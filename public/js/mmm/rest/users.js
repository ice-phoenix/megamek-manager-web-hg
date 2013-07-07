angular.module('mmm.rest.users', ['ngResource',
                                  'util.restutils'])

.factory('Users', ['$resource', 'restUtils', function($resource, restUtils) {

  var Users = $resource(
    '/api/admin/users/:id'
  );

  restUtils.attachInOut(Users);

  return Users;

}]); // 'factory'
