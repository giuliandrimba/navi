(function() {
  var _this = this;

  navi.Main = (function() {
    var current_page, next_page, routes;

    routes = [];

    Main.events = new navi.PubSub;

    current_page = null;

    next_page = null;

    Main.prototype.locked = false;

    function Main() {}

    Main.map = function(hash, object, el_target, options) {
      var modal, navi_page, page_api,
        _this = this;
      modal = false;
      if (options != null ? options.modal : void 0) {
        modal = true;
      }
      navi_page = new navi.Page({
        route: hash,
        page: object,
        target: el_target,
        params: null,
        modal: modal
      });
      routes.push(navi_page);
      page_api = window.page(hash, function(ctx) {
        navi_page.params = ctx.params;
        return _this.process_hash_change(navi_page);
      });
      return navi_page.regexp = page_api.format_hash(navi_page.route);
    };

    Main.init = function() {
      var hash;
      hash = window.location.hash.toString().substring(2);
      if (Main.has_valid_hash(hash)) {
        return window.page(hash).init();
      } else {
        return window.page(routes[0].route);
      }
    };

    Main.has_valid_hash = function() {
      var hash;
      hash = window.location.hash.toString().substring(2);
      if (this.get_page(hash)) {
        return true;
      }
      return false;
    };

    Main.go = function(page_name) {
      var page;
      page = this.get_page(page_name);
      if (page.modal && !this.locked) {
        this.process_hash_change(page);
        return;
      }
      if (!this.locked) {
        return window.page(page_name);
      }
    };

    Main.process_hash_change = function(navi_page) {
      Main.events.trigger("route_change", {
        page: navi_page.route
      });
      return Main.change_page(navi_page);
    };

    Main.change_page = function(navi_page) {
      var _this = this;
      this.next_page = navi_page.route;
      if (this.current_page) {
        if (navi_page.modal) {
          return this.add_next_page(navi_page);
        } else {
          return this.remove_current_page(function() {
            return _this.add_next_page(navi_page);
          });
        }
      } else {
        return this.add_next_page(navi_page);
      }
    };

    Main.remove_current_page = function(callback) {
      if (this.current_page.animating_in) {
        if (this.current_page.animating_out === false) {
          return this.current_page.outro(callback);
        }
      } else {
        if (this.current_page.animating_out === false) {
          return this.current_page.outro(callback);
        }
      }
    };

    Main.add_next_page = function(navi_page) {
      var _this = this;
      this.current_page = this.get_page(this.next_page);
      return this.current_page.load(function() {
        return _this.current_page.intro(navi_page.params, function() {
          return Main.events.trigger("page_change", navi_page.route);
        });
      });
    };

    Main.get_page = function(route) {
      var e, obj, rxp, _i, _j, _len, _len1, _ref;
      obj = null;
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        e = routes[_i];
        if (route.match(e.regexp)) {
          _ref = route.match(e.regexp);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            rxp = _ref[_j];
            if (rxp === route) {
              obj = e;
            }
          }
        }
      }
      return obj;
    };

    return Main;

  }).call(this);

  if (typeof define === 'function' && define.amd) {
    define(function() {
      window.page = new navi.Router();
      return navi.Main;
    });
  } else if ('undefined' === typeof module) {
    window.page = new navi.Router();
    window.Navi = navi.Main;
  } else {
    exports.map = function(hash, object, el_target) {
      return navi.Main.map(hash, object, el_target);
    };
    exports.go = function(page_name) {
      return navi.Main.go(page_name);
    };
    exports.init = function() {
      return navi.Main.init();
    };
    exports.bind = function(event, callback) {
      return navi.Main.events.bind(event, callback);
    };
    exports.unbind = function(event, callback) {
      return navi.Main.events.unbind(event, callback);
    };
  }

}).call(this);
