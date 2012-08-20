

path = require 'path'
fs = require 'fs'
WLoader = require '../lib/wloader.js'

###
 加载 Routes 定义的工具
	constructor:(@app,fdir, log, nowatch) ->
		super(fdir, log, nowatch) 
		
###
class RouteLoader extends  WLoader
	constructor:(@app,@loc,fdir, log, nowatch) ->
		super(fdir, log, nowatch) 

	doLoad:(f)->
		me = @
		sfunc = super(f)
		->
			t = sfunc()
			t?(me.app,me.loc)
			#console.log('my doLoad' ,t,me.app)
			return t

	loadAll:()->
		me = @
		#console.log(@_fdir,@_loadedfiles)
		fs.readdirSync(@_fdir ).forEach(
			(rf)->
				#todo:递归处理
				return unless /\.js$/.test(rf)
				me.load(rf)
		)
		return null


module.exports = RouteLoader



		


