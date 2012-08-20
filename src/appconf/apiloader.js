(function() {
  var Api, WLoader, path,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  path = require('path');

  WLoader = require('../lib/wloader.js');

  /*
  #
  # 加载Api方法定义的工具
  #
  */

  Api = (function(_super) {

    __extends(Api, _super);

    function Api() {
      Api.__super__.constructor.apply(this, arguments);
    }

    Api.prototype.get = function(method) {
      var c, cc, handlers, log, m, parts, rf;
      parts = method.split('.');
      c = parts[0];
      m = parts[1];
      handlers = this._loadedfiles;
      log = this._log;
      if (c in handlers) {
        cc = handlers[c];
      } else {
        rf = c + '.js';
        cc = this.load(rf);
      }
      if (!m) return handlers[c];
      if (cc && m in cc) return cc[m];
      log.error("Api controller error: ", c, 'not have', m);
      return null;
    };

    return Api;

  })(WLoader);

  module.exports = Api;

}).call(this);
