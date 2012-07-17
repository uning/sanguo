

var libdir = '../lib/'

// get required modules
var express = require('express')
,mongoose = require('mongoose')
,MongoStore = require('connect-mongo')
,stylus = require('stylus')
,nib = require('nib')
,RedisStore = require('connect-redis')(express)
,Redis = require("redis")

,s = require(libdir + 'configservice.js')
,date = require(libdir + 'date-ext.js')
,ID = require(libdir + 'sessionid.js')
,comm = require('../common.js')
,log = comm.getLogger('server')
,util = require('util')




// include commonjs-utils and extensions

// create server object
module.exports = app = express.createServer();







//configure server instance
app.configure(function(){

  //配置server,使用redis
  app.set('host', s.get('listenHost','login.playcrab.com'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.set('views', __dirname + '/views');
  // set jade as default view engine
  app.set('view engine', 'jade');


  // set stylus as css compile engine
  var compile = function(str, path){
    return stylus(str)
      .set('filename', path)
      .use(nib());
  };
  app.use(stylus.middleware(
    { src: __dirname + '/stylus', dest: __dirname + '/public', compile: compile }
  ));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  // use connect-mongo as session middleware
  //app.use(express.session({secret: 'topsecret',store: new MongoStore(app.set('mongodb'))}));

  app.use(express.session({secret: 'topsecret',store: new RedisStore({client: comm.getRedis(s.get('sessionRedis'),{exclusive:true}) })}));

  app.use(express.methodOverride());
  app.use(app.router);
  // use express logger
  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  app.use(express.static(__dirname + '/public'));

});

//configure mongoose models
loginuser = require('../model/loginuser.js');
app.User = User = loginuser.get(comm.getMongoose(s.get('userserver')));




app.get('/',function(req, res) {
	console.log('req.params',req.params);
	res.render('debug', {
		locals: {
			str: 'QUERY:\n' +util.inspect(req.querys)  + '\nPOST:\n' + +util.inspect(req.body)
			+'\nCOOKIE:\n' + util.inspect(req.cookies)
		}
	});
});




app.run = function(){
	app.listen(s.get('listenPort',80));
	// TODO: implement cluster as soon as its stable
  /* cluster(app)
	.set('workers', 2)
	.use(cluster.debug())
	.listen(app.set('port'));*/
   log.info("Chat app server listening on port ", app.address().port);
}

if (!module.parent) {
	app.run();
}
