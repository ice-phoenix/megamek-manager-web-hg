angular.module('mmm.ServerServices', ['ngResource'])
  .factory('mmmServer', function($resource) {
    return $resource('/mmm/servers\\/');
});
