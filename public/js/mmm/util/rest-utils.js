angular.module('util.restutils', [])

.factory('restUtils', function() {

  var service = {};

  service.attachInOut = function(obj, onIn, onOut) {
    var $onIn = onIn || angular.identity;
    var $onOut = onOut || angular.identity;

    obj['in'] = function(json) {
      if (angular.isArray(json)) {
        return json.map($onIn);
      } else {
        return $onIn(json);
      }
    };
    obj['out'] = function(json) {
      if (angular.isArray(json)) {
        return json.map($onOut);
      } else {
        return $onOut(json);
      }
    };
  };

  return service;

}); // 'factory'
