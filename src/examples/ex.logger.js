

var winston = require('winston');
/*
File Transport

  winston.add(winston.transports.File, options)
The File transport should really be the 'Stream' transport since it will accept any WritableStream. It is named such because it will also accept filenames via the 'filename' option:

level: Level of messages that this transport should log.
silent: Boolean flag indicating whether to suppress output.
colorize: Boolean flag indicating if we should colorize output.
timestamp: Boolean flag indicating if we should prepend output with timestamps (default false). If function is specified, its return value will be used instead of timestamps.
filename: The filename of the logfile to write output to.
maxsize: Max size in bytes of the logfile, if the size is exceeded then a new file is created.
maxFiles: Limit the number of files created when the size of the logfile is exceeded.
stream: The WriteableStream to write output to.
json: If true, messages will be logged as JSON (default true).
Metadata: Logged via util.inspect(meta);
*/
 
var log = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)( {
		colorize: true
		//*
		,timestamp:
			function(){
			return new Date().getTime()
		}

		//*/
	})
		//,new (winston.transports.File)({filename:__dirname+'/example.log'})
	]
	,exceptionHandlers: [
	       new winston.transports.File({ filename: __dirname +'/exceptions.log' })
	]
});


log.add(winston.transports.File,{filename:__dirname+'/example1.log',timestamp:true})
log.info('it a info')
log.warn('it is warn')
log.error('it is error')
log.debug('it is debug')
console.log(winston.config.syslog.levels);
