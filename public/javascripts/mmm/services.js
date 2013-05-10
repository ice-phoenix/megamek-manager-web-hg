angular.module('mmmServerServices', ['ngResource'])
  .factory('mmmServer', function($resource) {
    return $resource('/mmm/servers\\/');
});
