(function() {

  navi.PubSub = (function() {
    var listeners;

    listeners = [];

    function PubSub() {}

    PubSub.prototype.bind = function(event, callback) {
      return listeners.push({
        event: event,
        callback: callback
      });
    };

    PubSub.prototype.trigger = function(event, params) {
      var e, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        e = listeners[_i];
        if (e.event === event) {
          _results.push(e.callback(params));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    PubSub.prototype.unbind = function(event, callback) {
      var e, i, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = listeners.length; _i < _len; i = ++_i) {
        e = listeners[i];
        if (e.event === event && e.callback() === callback()) {
          _results.push(listeners.slice(i, 0));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return PubSub;

  })();

}).call(this);
