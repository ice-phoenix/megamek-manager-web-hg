angular.module('mmm.serverlist', ['ui.bootstrap',
                                  'mmm.rest.servers',
                                  'util.notifications',
                                  'util.modals',
                                  'util.collections'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/servers', {
      templateUrl: '/assets/templates/mmm/server-list.tmpl',
      controller: 'ServerListCtrl'
    })
}])

.controller('ServerListCtrl', ['$scope', 'Servers', 'notifications', 'modals', 'collections',
                      function( $scope,   Servers,   notifications,   modals,   collections ) {

  $scope.servers = collections.lut(function(e) { return e.port; });

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  $scope.queryServers = function() {
    Servers.query(
      {},
      function(json) {
        $scope.servers.clear();
        angular.forEach(Servers.transform(json), function(e) {
          $scope.servers.add(e);
        });
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.startServer = function(port) {
    if (angular.isUndefined(port)) port = $scope.startServerPort;
    Servers.put(
      {port: port},
      function(json) {
        $scope.servers.add(Servers.transform(json));
        notifications.addCurrent({type: 'success', msg: ['Started server on port', port].join(' ')});
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.stopServer = function(port) {
    Servers.remove(
      {port: port},
      function(json) {
        $scope.servers.remove(port);
        notifications.addCurrent({type: 'success', msg: ['Stopped server on port', port].join(' ')});
      },
      $scope.$restDefaultErrorHandler
    );
  }

  /////////////////////////////////////////////////////////////////////////////
  // Dialogs
  /////////////////////////////////////////////////////////////////////////////

  $scope.stopServerWithConfirm = function(port) {
    var e = $scope.servers.get(port);

    var title = 'Stop server';
    var msg = ['Stop server on port ', port, '?'].join('');
    var warn = e.players.length > 0 ? [e.players.length, ' players are ONLINE'].join('') : '';
    var buttons = [
      { label:'OK',     result: true,  cssClass: 'btn-danger' },
      { label:'Cancel', result: false, cssClass: 'btn-info' }
    ];

    var confirm = modals.confirm(title, msg, warn, buttons);

    confirm.open().then(function(result) {
        if (result === true) $scope.stopServer(port);
    });
  };

  /////////////////////////////////////////////////////////////////////////////
  // Sorting
  /////////////////////////////////////////////////////////////////////////////

  $scope.toggleSortBy = function(sortBy) {
    $scope.sortByReversed = (sortBy === $scope.sortBy ? !$scope.sortByReversed : false);
    $scope.sortBy = sortBy;
  }

  $scope.getSortByCls = function(sortBy) {
    if (sortBy === $scope.sortBy) {
      if ($scope.sortByReversed) {
        return "icon-arrow-up";
      } else {
        return "icon-arrow-down";
      }
    } else {
      return "icon-";
    }
  }

  $scope.getSortByKey = function(id) {
    var e = $scope.servers.get(id);
    switch ($scope.sortBy) {
      case 'port': return e.port;
      case 'players': return e.players.length;
      case 'status': return e.status;
      default: return 0;
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // Init
  /////////////////////////////////////////////////////////////////////////////

  $scope.startServerPort = 2345;
  $scope.sortBy = 'players';
  $scope.sortByReversed = true;

  $scope.queryServers();
}]);
