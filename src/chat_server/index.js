// get required modules
var libdir = '../lib/'
var s = require(libdir + 'configservice.js')
,comm = require(s.WORKROOT + '/src/common.js')
,express = require('../lib/myexpress')
,log = comm.getLogger(s.bootconfig.role)

/*
 *
*/
var app = module.exports  = express() 


//数据库model
app.set('model_LoginUser',require('../model/loginuser.js').get(comm.getMongoose(s.get('userMongo'))));
app.set('model_Admins' , require('../model/adminusers.js'));

//create server object
var server = require('http').createServer(app)
app.set('myserver',server);
app.set('mylog',log);

app.MYDIR = __dirname;
app.CONFIG = s;
app.enable('loginhelper');//加载loginheler
require('../appconf/server')(app,express,s,comm);
require('../appconf/auth')(app);




// require routes
var RL = require('../appconf/routeloader.js')
var rloader =  new RL(app,'',__dirname + '/routes')
rloader.loadAll();


//聊天逻辑
require('./chatio')(app);


//运行
app.run = function(){
	server.listen(s.get('listenPort',8880));
    require('./useronline.registry.js').start(app);
	console.log( s.bootconfig.role + " listen:",s.get('listenPort',8880));
}

if (!module.parent) {
	app.run();
}
