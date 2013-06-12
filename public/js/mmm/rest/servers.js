angular.module('mmm.rest.servers', ['ngResource'])

.factory('Servers', ['$resource', function($resource) {
  var Servers = $resource(
    '/api/servers/:port',
    {},
    {
      'put': { method: 'PUT', params: {port: '@port'} }
    }
  );

  Servers._transform = function(srv) {
    var res = {};
    res.port = srv.port || 0;
    res.players = srv.players || [];
    res.status = srv.type === 'server-online' ? 'Online' :
                 srv.type === 'server-timed-out' ? 'Timed out' :
                 srv.type === 'server-failed' ? 'Failed' :
                 'Unknown';
    res.statusCls = srv.type === 'server-online' ? 'success' :
                    srv.type === 'server-timed-out' ? 'warning' :
                    'error';
    return res;
  };

  Servers.transform = function(json) {
    if (angular.isArray(json)) {
      return json.map(Servers._transform);
    } else {
      return Servers._transform(json);
    }
  };

  return Servers;
}]);
