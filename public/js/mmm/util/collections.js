angular.module('util.collections', [])

.factory('collections', function() {

  var collectionFactory = {};

  collectionFactory.lut = function(luter) {
    var lut = {};

    lut.ids = [];
    lut.values = {};
    lut.luter = luter || angular.identity;

    lut.add = function(e) {
      var id = luter(e);

      lut.remove(id);

      lut.ids.push(id);
      lut.values[id] = e;

      return lut;
    };

    lut.remove = function(id) {
      var e = lut.values[id];

      if (angular.isDefined(e)) {
        var idx = lut.ids.indexOf(id);
        if (idx > -1) {
          lut.ids.splice(idx, 1);
        }
        delete lut.values[id];
      }

      return lut;
    };

    lut.get = function(id) {
      return lut.values[id];
    };

    lut.clear = function() {
      lut.ids.length = 0;
      lut.values = {};
      return lut;
    };

    return lut;
  };

  return collectionFactory;
});
