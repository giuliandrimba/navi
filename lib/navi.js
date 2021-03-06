/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);
var navi = {};

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    _this = this;

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

  navi.Page = (function(_super) {

    __extends(Page, _super);

    Page.prototype.removing = false;

    Page.prototype.animating_in = false;

    Page.prototype.animating_out = false;

    Page.prototype.active = false;

    Page.prototype.dependency = {};

    function Page(object) {
      this.outro = __bind(this.outro, this);

      this.intro = __bind(this.intro, this);

      this.load = __bind(this.load, this);
      this.target_dom = object != null ? object.target_dom : void 0;
      this.route = object != null ? object.route : void 0;
      this.object = object != null ? object.page : void 0;
      this.modal = object != null ? object.modal : void 0;
      this.dependency = object != null ? object.target_route : void 0;
    }

    Page.prototype.load = function(callback) {
      if (this.object.load) {
        this.object.load(callback);
      } else {
        callback();
      }
    };

    Page.prototype.intro = function(params, callback) {
      var _this = this;
      this.animating_in = true;
      this.el = this.object.render(params);
      if (this.modal) {
        $(this.target_dom).append(this.el);
      } else {
        $(this.target_dom).html(this.el);
      }
      return this.load(function() {
        return _this.object.intro(function() {
          callback();
          if (_this.removing === false) {
            return _this.animating_in = false;
          }
        });
      });
    };

    Page.prototype.outro = function(callback) {
      var _this = this;
      this.animating_out = true;
      this.removing = true;
      this.animating_in = false;
      return this.object.outro(function() {
        _this.animating_out = false;
        $(_this.target_dom).empty();
        return callback();
      });
    };

    return Page;

  })(navi.PubSub);

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
      console.log("process_hash_change");
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
      if (this.current_page.animating_in) {
        if (this.current_page.animating_out === false) {
          this.current_page.active = false;
          return this.current_page.outro(callback);
        }
      } else {
        if (this.current_page.animating_out === false) {
          this.current_page.active = false;
          return this.current_page.outro(callback);
        }
      }
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
        return page.intro(page.params, function() {
          page.active = true;
          return _this.load_dependencies(callback);
        });
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
