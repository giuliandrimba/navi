
;(function(){

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // route <path> to <callback ...>
    if ('function' == typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (false !== options.popstate) addEventListener('popstate', onpopstate, false);
    if (false !== options.click) addEventListener('click', onclick, false);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  page.show = function(path, state, init){
    var ctx = new Context(path, state);
    ctx.init = init;
    page.dispatch(ctx);
    history.pushState(ctx.state, ctx.title, path);
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  page.replace = function(path, state, init){
    var ctx = new Context(path, state);
    ctx.init = init;
    page.dispatch(ctx);
    history.replaceState(ctx.state, ctx.title, path);
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (!ctx.init) {
      page.stop();
      window.location = ctx.path;
    }
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    this.path = path;
    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.params = [];
  }

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.path);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    }
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys
      , m = this.regexp.exec(path);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array)  path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    } else {
      page.show(location.pathname, null, true);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;
    var href = el.getAttribute('href') || '';
    if (absolute(href) && !sameOrigin(href)) return;
    e.preventDefault();
    page.show(href);
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    return 0 == href.indexOf(location.origin);
  }

  /**
   * Check if `href` is absolute.
   */

  function absolute(href) {
    return ~href.indexOf('://');
  }

  /** 
   * Expose `page`.
   */

  // if ('undefined' == typeof module) {
     window.page = page;
  // } else {
  //   module.exports = page;
  // }

})();
var __t;

__t = function(ns, expose) {
  var curr, index, part, parts, _i, _len;
  curr = null;
  parts = [].concat = ns.split(".");
  for (index = _i = 0, _len = parts.length; _i < _len; index = ++_i) {
    part = parts[index];
    if (curr === null) {
      curr = eval(part);
      if (expose != null) {
        expose[part] = curr;
      }
      continue;
    } else {
      if (curr[part] == null) {
        curr = curr[part] = {};
        if (expose != null) {
          expose[part] = curr;
        }
      } else {
        curr = curr[part];
      }
    }
  }
  return curr;
};

var navi = {};

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  __t('navi').PubSub = (function() {
    var listeners;

    listeners = [];

    function PubSub() {}

    PubSub.prototype.bind = function(event, callback) {
      return listeners.push({
        event: event,
        callback: callback
      });
    };

    PubSub.prototype.trigger = function(event) {
      var e, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        e = listeners[_i];
        if (e.event === event) {
          _results.push(e.callback());
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

  __t('navi').Page = (function() {

    Page.prototype.removing = false;

    Page.prototype.animating_in = false;

    Page.prototype.animating_out = false;

    function Page(object) {
      this.out = __bind(this.out, this);

      this["in"] = __bind(this["in"], this);
      this.target = object.target;
      this.route = object.route;
      this.object = object.page;
    }

    Page.prototype["in"] = function(params, callback) {
      var _this = this;
      this.animating_in = true;
      this.el = this.object.render(params);
      $(this.target).html(this.el);
      return this.object["in"](function() {
        if (_this.removing === false) {
          _this.animating_in = false;
          return callback();
        }
      });
    };

    Page.prototype.out = function(callback) {
      var _this = this;
      this.animating_out = true;
      this.removing = true;
      this.animating_in = false;
      return this.object.out(function() {
        _this.animating_out = false;
        return callback();
      });
    };

    return Page;

  })();

  __t('navi').Main = (function() {
    var current_page, next_page, routes;

    routes = [];

    Main.events = new navi.PubSub;

    current_page = null;

    next_page = null;

    function Main() {}

    Main.map = function(hash, object, el_target) {
      var navi_page,
        _this = this;
      navi_page = new navi.Page({
        route: hash,
        page: object,
        target: el_target,
        params: null
      });
      routes.push(navi_page);
      return window.page("/#" + hash, function(ctx) {
        navi_page.params = ctx.params;
        return _this.process_hash_change(navi_page);
      });
    };

    Main.init = function() {
      var hash;
      hash = window.location.hash.toString().substring(1);
      return window.page("/#" + hash);
    };

    Main.has_valid_hash = function() {
      var hash;
      hash = window.location.hash.toString().substring(1);
      if (this.get_page(hash)) {
        return true;
      }
      return false;
    };

    Main.go = function(page_name) {
      return window.page("/#" + page_name);
    };

    Main.process_hash_change = function(navi_page) {
      Main.events.trigger("route_change");
      return Main.change_page(navi_page);
    };

    Main.change_page = function(navi_page) {
      var _this = this;
      this.next_page = navi_page.route;
      if (this.current_page) {
        return this.remove_current_page(function() {
          return _this.add_next_page(navi_page);
        });
      } else {
        return this.add_next_page(navi_page);
      }
    };

    Main.remove_current_page = function(callback) {
      if (this.current_page.animating_in) {
        if (this.current_page.animating_out === false) {
          return this.current_page.out(callback);
        }
      } else {
        if (this.current_page.animating_out === false) {
          return this.current_page.out(callback);
        }
      }
    };

    Main.add_next_page = function(navi_page) {
      console.log(navi_page.params);
      this.current_page = this.get_page(this.next_page);
      Main.events.trigger("page_change");
      return this.current_page["in"](navi_page.params, function() {});
    };

    Main.get_page = function(route) {
      var e, _i, _len;
      for (_i = 0, _len = routes.length; _i < _len; _i++) {
        e = routes[_i];
        if (e.route === route) {
          return e;
        }
      }
    };

    return Main;

  }).call(this);

  if ('undefined' === typeof module) {
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
