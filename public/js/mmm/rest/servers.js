angular.module('mmm.rest.servers', ['ngResource',
                                    'util.restutils'])

.factory('Servers', ['$resource', 'restUtils', function($resource, restUtils) {

  var Servers = $resource(
    '/api/servers/:port',
    {},
    {
      'put': { method: 'PUT', params: {port: '@port'} }
    }
  );

  var $in = function(srv) {
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

  restUtils.attachInOut(Servers, $in);

  return Servers;

}]); // 'factory'
