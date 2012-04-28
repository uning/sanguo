
var winston = require('winston')
,LOGROOT = __dirname +'/../../logs/'
,exceptlog = new winston.transports.File({ filename:  LOGROOT + 'exceptions.log' })
,tconsole = new (winston.transports.Console)( {
	colorize:  true
	,timestamp:  true
	,handleExceptions: true 
})


//缓存已经创建的logger
var loggers = {}
var get = exports.get = function(name,opts){
	name = name || 'default'
	var log = loggers[name]
	if(log ){
		return log;
	}
	opts = opts || {}
	var t  = {filename:LOGROOT+name+'.log',timestamp:true, handleExceptions: true }
	t.level = opts.level || 'debug'
	var p = {
		transports: [
			,new (winston.transports.File)(t)
		]
		,exceptionHandlers: [
			exceptlog
		]
		,exitOnError:false
	}
	if(opts.console !== false)
		p.transports.push(tconsole)
	return loggers[name] = new (winston.Logger)(p)

}

