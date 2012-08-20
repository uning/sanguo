

path = require 'path'
WLoader = require '../lib/wloader.js'

###
#
# 加载Api方法定义的工具
#
###
class Api extends  WLoader

	get:(method)->
		parts = method.split '.'
		c = parts[0]
		m = parts[1]
		handlers = @_loadedfiles
		log = @_log

		if c of handlers
			cc = handlers[c]
		else
			rf = c + '.js'
			cc = @load(rf)
		return handlers[c] unless m
		return cc[m] if cc and  m of cc
		log.error "Api controller error: ",c, 'not have',m
		return null


module.exports = Api



		


