angular.module('mmm.rest.admin.config', ['ngResource'])

.factory('AdminConfig', ['$resource', function($resource) {
  var AdminConfig = $resource(
    '/mmm/admin/config'
  );

  AdminConfig._transform = function(srv) {
    var res = srv;

    res.keys = function(e) {
      var r = [];
      for (var key in e) {
        if (e.hasOwnProperty(key)) {
          r.push(key);
        }
      }
      return r;
    } (srv);

    return res;
  };

  AdminConfig.transform = function(json) {
    if (angular.isArray(json)) {
      return json.map(AdminConfig._transform);
    } else {
      return AdminConfig._transform(json);
    }
  };

  return AdminConfig;
}]);
