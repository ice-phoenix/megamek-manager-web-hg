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

  var times = [
    {key: 'years',   singular: 'year'},
    {key: 'months',  singular: 'month'},
    {key: 'days',    singular: 'day'},
    {key: 'hours',   singular: 'hour'},
    {key: 'minutes', singular: 'minute'},
    {key: 'seconds', singular: 'second'}
  ];

  service.formatDateTime = function(dateTime) {
    var $dateTime = dateTime || {};

    for (var i = 0; i < times.length; ++i) {
      var t = times[i];
      var value = $dateTime[t.key];
      if (angular.isDefined(value)) {
        return [value, value === 1 ? t.singular : t.key].join(' ');
      }
    }
    return '1 clock tick';
  };

  service.formatDateTimeFull = function(dateTime) {
    var $dateTime = dateTime || {};

    var res = [];

    for (var i = 0; i < times.length; ++i) {
      var t = times[i];
      var value = ($dateTime[t.key] || 0) + '';
      res.push(value.pad(2));
    }

    return res.join(':');
  };

  return service;

}); // 'factory'
