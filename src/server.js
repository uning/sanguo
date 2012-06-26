
// get required modules
express = require('express'),
  mongoose = require('mongoose'),
  stylus = require('stylus'),
  nib = require('nib'),
  MongoStore = require('connect-mongo'),
  RedisStore = require('connect-redis')(express),
  Redis = require("redis"),
  models = require('./models'),
  ID = require('./id')
  log = require('./logger').get()

  Admins = require('./adminusers')



// include authentication helpers
auth = require('./auth').AuthHelper;
//用户列表 
uor = require('./useronline.registry').UserOnlineRegistry;

// include commonjs-utils and extensions
json = require('commonjs-utils/lib/json-ext');
base64 = require('commonjs-utils/lib/base64');
date = require('./date-ext');

// create server object
exports.module = app = express.createServer();


// setup helpers
app.helpers(require('./helpers.js').helpers);
app.dynamicHelpers(require('./helpers.js').dynamicHelpers);

//require config
require('./config');



getRedisClient = function(rcc){
	var rc = Redis.createClient(rcc.port  ,rcc.host)
	rc.on("error", function (err) {
		log.error("Redis Error:" ,rcc, err);
	});
	rc.on('end',function(err){
		log.info("Redis end:",rcc , err);
	})
	rc.on('ready',function(err){
		log.debug("Redis ready:",rcc , err);
	})
	return rc;
}

//configure server instance
app.configure(function(){
  var monconf = app.set('mongodb');
  app.set('connstring', 'mongodb://' + monconf.host +':'+ monconf.port +'/' + monconf.db);
  app.set('views', __dirname + '/../views');
  // set jade as default view engine
  app.set('view engine', 'jade');
  //app.set('view engine', 'coffee');app.register('.coffee', require('coffeekup').adapters.express);


  // set stylus as css compile engine
  var compile = function(str, path) {
    return stylus(str)
      .set('filename', path)
      .use(nib());
  };
  app.use(stylus.middleware(
    { src: __dirname + '/../stylus', dest: __dirname + '/../public', compile: compile }
  ));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  // use connect-mongo as session middleware
  //app.use(express.session({secret: 'topsecret',store: new MongoStore(app.set('mongodb'))}));
  app.use(express.session({secret: 'topsecret',store: new RedisStore({client: getRedisClient(app.set('sessionredis'))}) }));
  app.use(express.methodOverride());
  app.use(app.router);
  // use express logger
  //app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  app.use(express.static(__dirname + '/../public'));
});

//configure mongoose models
models.defineModels(mongoose, function() {
  app.User = User = mongoose.model('User');
  app.LoginToken = LoginToken = mongoose.model('LoginToken');
  db = mongoose.connect(app.set('connstring'));
});


// require routes
require('./routes/chat');
require('./routes/user');
require('./routes/help');
require('./routes/admin');



require('./sio');
sio.log = log;
log.level = sio.set('log level')
rc = getRedisClient(app.set('confserver'))

app.run = function(){
	app.listen(app.set('port'));
	setInterval(uor.clearTimeOutUser,app.set('clearTimeOutUser'));
	log.debug('clearTimeOutUser',app.set('clearTimeOutUser'),'env',process.env['NODE_ENV'])
	// TODO: implement cluster as soon as its stable
  /* cluster(app)
	.set('workers', 2)
	.use(cluster.debug())
	.listen(app.set('port'));*/
   log.info("Chat app server listening on port %d", app.address().port);
}

if (!module.parent) {
	app.run();
}
