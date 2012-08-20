(function() {
  var RouteLoader, WLoader, fs, path,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs');

  WLoader = require('../lib/wloader.js');

  /*
   加载 Routes 定义的工具
  	constructor:(@app,fdir, log, nowatch) ->
  		super(fdir, log, nowatch)
  */

  RouteLoader = (function(_super) {

    __extends(RouteLoader, _super);

    function RouteLoader(app, loc, fdir, log, nowatch) {
      this.app = app;
      this.loc = loc;
      RouteLoader.__super__.constructor.call(this, fdir, log, nowatch);
    }

    RouteLoader.prototype.doLoad = function(f) {
      var me, sfunc;
      me = this;
      sfunc = RouteLoader.__super__.doLoad.call(this, f);
      return function() {
        var t;
        t = sfunc();
        if (typeof t === "function") t(me.app, me.loc);
        return t;
      };
    };

    RouteLoader.prototype.loadAll = function() {
      var me;
      me = this;
      fs.readdirSync(this._fdir).forEach(function(rf) {
        if (!/\.js$/.test(rf)) return;
        return me.load(rf);
      });
      return null;
    };

    return RouteLoader;

  })(WLoader);

  module.exports = RouteLoader;

}).call(this);
