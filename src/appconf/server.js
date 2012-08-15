
/**
 *
 * server 的通用配置代码
 * 设置mvr
 *
 * @param app  {express()}
 * @param express {express}
 * @param s    {configservice} 
 * @param comm {common} 
 *
 */
module.exports = function(app,express,s,comm){
	var stylus = require('stylus')
	,nib = require('nib')
	,RedisStore = require('connect-redis')(express)

  var self = this;

  //设置全局页面helper
  app.locals({
	  appName: s.get('appName','chat-server'),
	  version: s.get('version','0.0.1')
  });

  app.configure(function(){
	  app.set('host', s.get('listenHost','chat.playcrab.com'));

	  //模板设置
	  app.set('views', app.MYDIR + '/views');
	  app.set('view engine', 'jade');
	  //app.set('view engine', 'coffee');app.register('.coffee', require('coffeekup').adapters.express);
	  //set stylus as css compile engine
	
	  var compile = function(str, path){
		  return stylus(str)
		  .set('filename', path)
		  .use(nib());
	  };


	  //生成的静态文件，统一放到 WORKTROOT/public/compiled/ + s.role 下面
	  var compiledDir = '/public/compiled/' +  s.bootconfig.role;
	  app.use(stylus.middleware(
		  { src: app.MYDIR + '/stylus', dest: s.WORKROOT + compiledDir , compile: compile }
	  ));
	  app.use(express.bodyParser());
	  app.use(express.cookieParser());

	  // use connect-mongo as session middleware
	  //app.use(express.session({secret: 'topsecret',store: new MongoStore(app.set('mongodb'))}));

	  //默认session 均使用 Redis
	  if(s.get('sessionRedis','') !== '')
		  app.use(express.session({secret: 'topsecret',store: new RedisStore({client: comm.getRedis(s.get('sessionRedis'),{exclusive:true}) })}));

	  //设置flash显示的消息
	  app.use(function(req,res,next){
		  req.flash = req.flash || function(type,msg){
			  req._flashmsgs = req._flashmsgs || [];
			  if(msg)
				  req._flashmsgs.push(msg)
			  return req._flashmsgs
		  }
		  //console.log('iiiii 设置flash显示的消息')
		  next();
	  })

	  app.use(express.methodOverride());

      if(app.enabled('loginhelper')){//加载login
		  require('./loginhelper')(app);
	  }

	  app.use(app.router);

	  // use express logger
	  if(s.get('isDev',true)){
		  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
		  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
	  }else{
		  app.use(express.errorHandler()); 
	  }

	  //静态文件目录设置
	  app.use(express.static(s.WORKROOT + '/public'));
	  app.use(express.static(s.WORKROOT + compiledDir));
  });


  //env specific config
  app.configure('development', function(){
  });
  app.configure('production', function(){
    //app.use(express.errorHandler());
  });
  return self;
};
