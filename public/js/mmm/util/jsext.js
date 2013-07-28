angular.module('js.ext', [])

.config(function() {

  if (angular.isUndefined(String.prototype.pad)) {
    String.prototype.pad = function(size) {
      var padding = (size > this.length ? size - this.length : 0) + 1;
      var zeroes = '';
      while (--padding > 0) zeroes = zeroes + '0';
      return zeroes + this;
    };
  }

});
