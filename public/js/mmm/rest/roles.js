angular.module('mmm.rest.roles', ['ngResource',
                                  'util.restutils'])

.factory('Roles', ['$resource', 'restUtils', function($resource, restUtils) {

  var Roles = $resource(
    '/api/admin/roles'
  );

  restUtils.attachInOut(Roles);

  return Roles;

}]); // 'factory'
