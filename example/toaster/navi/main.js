(function() {
  var _this = this;

  navi.Main = (function() {
    var current_page, next_page, old_page, routes;

    routes = [];

    Main.events = new navi.PubSub;

    current_page = null;

    next_page = null;

    old_page = null;

    Main.prototype.locked = false;

    Main.prototype.modal = false;

    Main.prototype.target_route = null;

    Main.prototype.target_dom = null;

    Main.prototype.dependencies = [];

    function Main() {}

    Main.map = function(hash, object, options) {
      var modal, navi_page, page_api, target_dom, target_route,
        _this = this;
      modal = options != null ? options.modal : void 0;
      target_route = options != null ? options.route : void 0;
      target_dom = options != null ? options.dom : void 0;
      navi_page = new navi.Page({
        route: hash,
        page: object,
        target_dom: target_dom,
        target_route: target_route,
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

    Main.next_page_dependency = function(page) {
      return Main.get_page(page.dependency);
    };

    Main.change_page = function(navi_page) {
      var next_page_obj,
        _this = this;
      this.next_page = navi_page.route;
      next_page_obj = this.get_page(this.next_page);
      if (this.current_page && !navi_page.modal) {
        if (this.get_page(next_page_obj.dependency) !== this.current_page) {
          return this.remove_current_page(function() {
            return _this.add_next_page(navi_page);
          });
        } else {
          return this.add_next_page(navi_page);
        }
      } else {
        return this.add_next_page(navi_page);
      }
    };

    Main.remove_current_page = function(callback) {
      this.current_page.active = false;
      return this.current_page.outro(callback);
    };

    Main.add_next_page = function(navi_page) {
      if (Main.current_page) {
        Main.old_page = Main.current_page;
      }
      Main.current_page = Main.get_page(Main.next_page);
      Main.dependencies = [];
      if (!Main.current_page.active) {
        return Main.add_dependencies(Main.current_page, function() {
          return Main.current_page.intro(navi_page.params, function() {
            Main.current_page.active = true;
            return Main.events.trigger("page_change", navi_page.route);
          });
        });
      } else {
        return Main.events.trigger("page_change", navi_page.route);
      }
    };

    Main.add_dependencies = function(navi_page, callback) {
      if (navi_page.dependency && Main.get_page(navi_page.dependency) !== Main.old_page) {
        Main.dependencies.push(Main.get_page(navi_page.dependency));
        return Main.add_dependencies(Main.get_page(navi_page.dependency), callback);
      } else {
        return Main.load_dependencies(callback);
      }
    };

    Main.load_dependencies = function(callback) {
      var page,
        _this = this;
      if (this.dependencies.length) {
        page = this.dependencies.pop();
        if (!page.active) {
          return page.intro(page.params, function() {
            page.active = true;
            return _this.load_dependencies(callback);
          });
        } else {
          return this.load_dependencies(callback);
        }
      } else {
        return callback();
      }
    };

    Main.get_page = function(route) {
      var e, obj, rxp, _i, _j, _len, _len1, _ref;
      obj = null;
      if (!route) {
        return obj;
      }
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
