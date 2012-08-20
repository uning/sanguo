(function() {
  var WLoader, fs, path;

  fs = require("fs");

  path = require("path");

  WLoader = (function() {

    function WLoader(fdir, log, nowatch, noautoload) {
      var me, _fdir, _watchers;
      this._loadedfiles = {};
      this._fdir = path.normalize(fdir);
      this._log = log || (log = require("../common.js").getLogger());
      this.autoload = !noautoload;
      if (!nowatch) {
        this._watchers = {};
        me = this;
        _watchers = this._watchers;
        _fdir = this._fdir;
        fs.watch(_fdir, function(ev, rf) {
          var f;
          f = fdir + "/" + rf;
          log.debug("WLoader watch for reload: ", _fdir, rf, ev);
          if (!/\.js$/.test(rf)) return;
          if (f in _watchers) {
            return typeof _watchers[f] === "function" ? _watchers[f]() : void 0;
          } else {
            return me.autoload && me.load(rf);
          }
        });
      }
    }

    return WLoader;

  })();

  WLoader.prototype.doLoad = function(f) {
    var log, _loadedfiles;
    _loadedfiles = this._loadedfiles;
    log = this._log;
    return function() {
      var ncc;
      if (!fs.existsSync(f)) {
        log.error("WLoader load for  file " + f + ": file not exists");
        return null;
      }
      delete require.cache[f];
      try {
        ncc = require(f);
      } catch (err) {
        log.error("WLoader load for  file " + f + ": syntax error", err);
        return null;
      }
      if (ncc) {
        _loadedfiles[f] = ncc;
        log.info("WLoader load for  file " + f + ": ok");
      } else {
        log.error("WLoader load for  file " + f + ": require return null");
      }
      return ncc;
    };
  };

  WLoader.prototype.load = function(rf) {
    var cc, f, load, log, _loadedfiles, _watchers;
    f = path.normalize(this._fdir + '/' + rf);
    _loadedfiles = this._loadedfiles;
    if (f in _loadedfiles) return _loadedfiles[f];
    log = this._log;
    load = this.doLoad(f);
    cc = load();
    if (cc) {
      _watchers = this._watchers;
      if (_watchers) _watchers[f] = load;
    }
    return cc;
  };

  module.exports = WLoader;

}).call(this);
