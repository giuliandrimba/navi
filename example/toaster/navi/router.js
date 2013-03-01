(function() {

  navi.Router = (function() {

    function Router() {
      var _this = this;
      this.states = [];
      $(window).hashchange(function(e) {
        return _this.change_route(window.location.hash.toString());
      });
      return function(hash, callback) {
        if (callback) {
          _this.states.push({
            hash: hash,
            callback: callback,
            regexp: _this.format_hash(hash)
          });
        }
        if (!(callback && (hash.length > 1))) {
          window.location.hash = "/" + hash;
        }
        return _this;
      };
    }

    Router.prototype.format_hash = function(hash) {
      var rgx, str;
      rgx = /(:[^\/]*)/g;
      str = hash.replace(/(:[^\/]*)/g, "(.*)");
      rgx = new RegExp(str);
      return rgx;
    };

    Router.prototype.change_route = function(hash) {
      var params, route, _i, _len, _ref, _results;
      hash = hash.substring(2);
      _ref = this.states;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        if (route.regexp.test(hash)) {
          if ((params = hash.match(route.regexp))[0] === hash) {
            _results.push(route.callback({
              params: params.splice(1, 4)
            }));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Router.prototype.init = function() {
      return this.change_route(window.location.hash.toString());
    };

    return Router;

  })();

}).call(this);
