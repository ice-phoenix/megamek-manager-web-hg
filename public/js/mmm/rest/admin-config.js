angular.module('mmm.rest.admin.config', ['ngResource'])

.factory('AdminConfig', ['$resource', function($resource) {
  var AdminConfig = $resource(
    '/api/admin/config',
    {},
    {
      'put': { method: 'PUT', params: {} }
    }
  );

  AdminConfig._keyify = function(e) {
    var keys = [];
    for (var key in e) {
      if (e.hasOwnProperty(key) && key.lastIndexOf('$', 0) === -1) {
        keys.push(key);
      }
    }

    e.$keys = keys;
    return e;
  }

  AdminConfig._transform = function(cfg) {
    var res = angular.copy(cfg);
    res = AdminConfig._keyify(res);
    return res;
  };

  AdminConfig._untransform = function(cfg) {
    var res = angular.copy(cfg);
    delete res.$keys;
    return res;
  };

  AdminConfig.merge = function(dst, src) {
    var res = angular.extend(dst, src);
    res = AdminConfig._keyify(dst);
    return res;
  }

  AdminConfig.transform = function(json) {
    if (angular.isArray(json)) {
      return json.map(AdminConfig._transform);
    } else {
      return AdminConfig._transform(json);
    }
  };

  AdminConfig.untransform = function(data) {
    if (angular.isArray(data)) {
      return data.map(AdminConfig._untransform);
    } else {
      return AdminConfig._untransform(data);
    }
  };

  return AdminConfig;
}]);
