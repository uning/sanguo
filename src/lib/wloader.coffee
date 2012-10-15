fs = require("fs")
path = require("path")

#
#
# watch loader (do require when file changed)
# 
# @param fdir 监控load文件所在路径
#
class WLoader
	constructor:(fdir, log, nowatch,noautoload) ->
		@_loadedfiles = {}
		@_fdir = path.normalize(fdir)
		@_log = log ||= require("../common.js").getLogger()
		@autoload = not noautoload 
		if not nowatch
			@_watchers = {}
			me = this
			_watchers = @_watchers
			_fdir = @_fdir
			fs.watch _fdir, (ev, rf) ->
				f = fdir + "/" +  rf
				log.debug "WLoader watch for reload: ",_fdir, rf, ev
				return unless /\.js$/.test(rf)
				if f of _watchers
					#setTimeout(_watchers[f],100)
					_watchers[f]?()
				else
					me.autoload && me.load(rf)
		  




#
#加载文件
#@param 文件名
#
WLoader::doLoad = (f) ->
  _loadedfiles = @_loadedfiles
  log = @_log
  ->
    unless fs.existsSync(f)
      log.error "WLoader load for  file " + f + ": file not exists"
      return null
    delete require.cache[f]
    try
      ncc = require(f)
    catch err
      log.error "WLoader load for  file " + f + ": syntax error",err
      return null
      
    if ncc
      _loadedfiles[f] = ncc
      log.info "WLoader load for  file " + f + ": ok"
    else
      log.error "WLoader load for  file " + f + ": require return null"
    #log.info  fs.readFileSync(f,'utf8')
    ncc
#
#重新加载文件
#
#@param rf  相对目录的文件名
#
WLoader::load = (rf) ->
  f = path.normalize(@_fdir + '/' + rf)
  _loadedfiles = @_loadedfiles
  if f of _loadedfiles
	  return  _loadedfiles[f]

  log = @_log
  load =  @doLoad(f)
  cc = load()
  if cc
    _watchers = @_watchers
    _watchers[f] = load  if _watchers
  cc

module.exports  = WLoader
