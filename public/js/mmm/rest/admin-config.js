angular.module('mmm.rest.admin.config', ['ngResource',
                                         'util.restutils'])

.factory('AdminConfig', ['$resource', 'restUtils', function($resource, restUtils) {

  var AdminConfig = $resource(
    '/api/admin/config',
    {},
    {
      'put': { method: 'PUT', params: {} }
    }
  );

  var $keyify = function(e) {
    var keys = [];
    for (var key in e) {
      if (e.hasOwnProperty(key) && key.lastIndexOf('$', 0) === -1) {
        keys.push(key);
      }
    }
    e.$keys = keys;
    return e;
  }

  var $in = function(cfg) {
    return $keyify(angular.copy(cfg));
  };

  var $out = function(cfg) {
    var res = angular.copy(cfg);
    delete res.$keys;
    return res;
  };

  restUtils.attachInOut(AdminConfig, $in, $out);

  AdminConfig.merge = function(dst, src) {
    return $keyify(angular.extend(dst, src));
  }

  return AdminConfig;

}]); // 'factory'
