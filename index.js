




var s = require('./src/lib/configservice.js')
,comm = require('./src/common.js')
,fs = require('fs')
,path = require('path')
,log

var usage = function(err){
	if(typeof err === 'string')
		console.log('ERROR: '+err)
	if(err === undefined || err){
		console.log('usage:\n'
					+'  node index.js <bootfile> \n'
					+'  BOOTFILE="/path/to/bootfile" node index.js \n'
					+'       $op :start|stop|reload|restart\n'
				   );
		process.exit(0);
	}
			
}

process.argv.forEach(function (val, index, array) {
	if( '-h'===val || '-help' === val || 'help'  ===val ){
		usage();
		process.exit(0);

	}
});

var run = function(err){
   //根据不同配置，加载不同模块
	usage(err);
	var ser= s.bootconfig.role.split('.')[0];
        log = comm.getLogger()
	log.info('run as ',ser)
	///*
	var server =  require ('./src/'+ser);
	server.run();
	//*/
}

s.btload(process.argv[2],run);


var pidfile = process.cwd() + '/pids/'+path.basename(s.bootconfig.mefile,'.js')+'.pid'
if(fs.existsSync(pidfile)){
	console.log(pidfile + '  exists .exit ')
//	console.exit(1);
}

fs.writeFile( pidfile, process.pid, function (err) {
  if (err) throw err;
  log.info('pid  saved in file:"' , pidfile , '" ' + process.pid );
});

/*
process.on('uncaughtException', function (err) {
  log.error('Caught exception: ' + err);
  console.trace();
});
*/

process.on('exit',function(){
	log.warn('process ',process.pid + ' exit, running time: ', process.uptime(),' seconds')
	fs.unlinkSync(pidfile)
})

/*
process.on('uncaughtException',function(ex){
	log.warn('process ',process.pid + ' uncaughtException, running time: ', process.uptime(),' seconds')
   console.log('Caught exception: ', ex);
	process.exit(0);
})
*/

process.on('SIGHUP', function () {
  log.error('Got SIGHUP signal.');
});
process.on('SIGINT', function () {
    log.error('Got signal SIGINT');//kill
	 process.exit(0);
});
process.on('SIGTERM', function () {
    log.info('Got SIGTERM signal.' );
	process.exit(0);
});
process.on('SIGPIPE', function () {
  console.error('Got SIGPIPE signal.');
});

