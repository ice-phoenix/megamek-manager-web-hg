angular.module('mmm.rest.servers', ['ngResource'])

.factory('Servers', ['$resource', function($resource) {
  return $resource('/mmm/servers\\/:serverPort');
}]);
