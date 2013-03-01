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

  navi.Page = (function() {

    Page.prototype.removing = false;

    Page.prototype.animating_in = false;

    Page.prototype.animating_out = false;

    function Page(object) {
      this.outro = __bind(this.outro, this);

      this.intro = __bind(this.intro, this);
      this.target = object.target;
      this.route = object.route;
      this.object = object.page;
      this.modal = object.modal;
    }

    Page.prototype.intro = function(params, callback) {
      var _this = this;
      this.animating_in = true;
      this.el = this.object.render.apply(null, params);
      if (this.modal) {
        $(this.target).append(this.el);
      } else {
        $(this.target).html(this.el);
      }
      return this.object.intro(function() {
        callback();
        if (_this.removing === false) {
          return _this.animating_in = false;
        }
      });
    };

    Page.prototype.outro = function(callback) {
      var _this = this;
      this.animating_out = true;
      this.removing = true;
      this.animating_in = false;
      return this.object.outro(function() {
        _this.animating_out = false;
        return callback();
      });
    };

    return Page;

  })();

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
      return this.current_page.intro(navi_page.params, function() {
        return Main.events.trigger("page_change", navi_page.route);
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
