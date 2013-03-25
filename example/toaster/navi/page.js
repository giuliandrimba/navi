(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
      this.el = this.object.render.apply(null, params);
      if (this.modal) {
        $(this.target_dom).append(this.el);
      } else {
        $(this.target_dom).html(this.el);
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
        $(_this.target_dom).empty();
        return callback();
      });
    };

    return Page;

  })(navi.PubSub);

}).call(this);
