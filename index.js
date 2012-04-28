




var s = require('./src/lib/configservice.js')
,comm = require('./src/common.js')
,log = comm.getLogger()
,fs = require('fs')
,path = require('path')

var usage = function(err){
	if(typeof err === 'string')
		console.log('ERROR: '+err)
	if(err === undefined || err)
	console.log('usage:\n'
				+'  node index.js <bootfile>\n'
				+'  BOOTFILE="/path/to/bootfile" node index.js\n'
			);
}

process.argv.forEach(function (val, index, array) {
	if('-h'===val || '-help' === val || 'help'  ===val){
		usage();
		process.exit(0);

	}
});

s.btlload(process.argv[2],usage);

//根据不同配置，加载不同模块
if(0){
require ('./src/server')
app.run();
}

var pidfile = process.cwd() + '/pids/'+path.basename(s.bootconfig.mefile,'.js')+'.pid'


fs.writeFile( pidfile, process.pid, function (err) {
  if (err) throw err;
  log.info('pid  saved in file:"' , pidfile , '" ' + process.pid );
});

process.on('uncaughtException', function (err) {
  log.error('Caught exception: ' + err);
  console.trace();
});

process.on('exit',function(){
	log.error('process ',process.pid + ' exit, running time: ', process.uptime(),' seconds')
	fs.unlinkSync(pidfile)
})
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
