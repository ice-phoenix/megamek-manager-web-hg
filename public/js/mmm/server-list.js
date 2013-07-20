angular.module('mmm.serverlist', ['ui.bootstrap',
                                  'mmm.rest.servers',
                                  'util.auth',
                                  'util.directive.activeonrole',
                                  'util.collections',
                                  'util.modals',
                                  'util.notifications'])

.config(['$routeProvider', 'authDeferProvider', function($routeProvider, authDeferProvider) {
  $routeProvider
    .when('/servers', {
      templateUrl: '/assets/templates/mmm/server-list.tmpl',
      controller: 'ServerListCtrl',
      resolve: {
        requiredRole: authDeferProvider.requiredRole('User')
      }
    });
}]) // 'config'

.controller('ServerListCtrl', ['$scope', 'Servers', 'collections', 'modals', 'notifications',
                      function( $scope,   Servers,   collections,   modals,   notifications ) {

  $scope.model = {};
  $scope.ctrl = {};

  $scope.model.servers = collections.lut(function(e) { return e.port; });

  /////////////////////////////////////////////////////////////////////////////
  // JSON REST API
  /////////////////////////////////////////////////////////////////////////////

  var $loadServers = function() {
    Servers.query(
      {},
      function(json) {
        $scope.model.servers.clear();
        angular.forEach(Servers.in(json), function(e) {
          $scope.model.servers.add(e);
        });
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.ctrl.startServer = function(port) {
    if (angular.isUndefined(port)) port = $scope.model.startServerPort;
    Servers.put(
      {port: port},
      function(json) {
        $scope.model.servers.add(Servers.in(json));
        notifications.addCurrentMsg('success', ['Started server on port', port].join(' '));
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.ctrl.stopServer = function(port) {
    Servers.remove(
      {port: port},
      function(json) {
        $scope.model.servers.remove(port);
        notifications.addCurrentMsg('success', ['Stopped server on port', port].join(' '));
      },
      $scope.$restDefaultErrorHandler
    );
  };

  $scope.ctrl.resetServer = function(port) {
    Servers.update(
      {port: port},
      {cmd: "reset"},
      function(json) {
        $scope.model.servers.add(Servers.in(json));
        notifications.addCurrentMsg('success', ['Resetted server on port', port].join(' '));
      },
      $scope.$restDefaultErrorHandler
    );
  };

  /////////////////////////////////////////////////////////////////////////////
  // Dialogs
  /////////////////////////////////////////////////////////////////////////////

  $scope.ctrl.stopServerWithConfirm = function(port) {
    var e = $scope.model.servers.get(port);

    var title = 'Stop server';
    var msg = ['Stop server on port ', port, '?'].join('');
    var warn = e.players.length > 0 ? [e.players.length, ' player(s) ONLINE'].join('') : '';
    var buttons = [
      { label:'OK',     result: true,  cssClass: 'btn-danger' },
      { label:'Cancel', result: false, cssClass: 'btn-info' }
    ];

    var confirm = modals.confirm(title, msg, warn, buttons);

    confirm.open().then(function(result) {
      if (result) $scope.ctrl.stopServer(port);
    });
  };

  $scope.ctrl.resetServerWithConfirm = function(port) {
    var e = $scope.model.servers.get(port);

    var title = 'Reset server';
    var msg = ['Reset server on port ', port, '?'].join('');
    var warn = e.players.length > 0 ? [e.players.length, ' player(s) ONLINE'].join('') : '';
    var buttons = [
      { label:'OK',     result: true,  cssClass: 'btn-danger' },
      { label:'Cancel', result: false, cssClass: 'btn-info' }
    ];

    var confirm = modals.confirm(title, msg, warn, buttons);

    confirm.open().then(function(result) {
      if (result) $scope.ctrl.resetServer(port);
    });
  };

  /////////////////////////////////////////////////////////////////////////////
  // Sorting
  /////////////////////////////////////////////////////////////////////////////

  $scope.ctrl.toggleSortBy = function(sortBy) {
    if (sortBy !== $scope.model.sortBy) {
      $scope.model.sortByReversed = false;
      $scope.model.sortBy = sortBy;
    } else {
      $scope.model.sortByReversed = !$scope.model.sortByReversed;
    }
  };

  $scope.ctrl.getSortByCls = function(sortBy) {
    if (sortBy === $scope.model.sortBy) {
      if ($scope.model.sortByReversed) {
        return 'icon-arrow-up';
      } else {
        return 'icon-arrow-down';
      }
    } else {
      return "icon-";
    }
  };

  $scope.ctrl.getSortByKey = function(id) {
    var e = $scope.model.servers.get(id);
    switch ($scope.model.sortBy) {
      case 'port': return e.port;
      case 'players': return e.players.length;
      case 'status': return e.status;
      default: return 0;
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  // Init
  /////////////////////////////////////////////////////////////////////////////

  $scope.model.startServerPort = 2345;
  $scope.model.sortBy = 'port';
  $scope.model.sortByReversed = false;

  $loadServers();

}]); // 'controller'
