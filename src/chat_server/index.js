// get required modules
var libdir = '../lib/'
var s = require(libdir + 'configservice.js')
,comm = require(s.WORKROOT + '/src/common.js')
,express = require('express')
,log = comm.getLogger(s.bootconfig.role)

/*
 *
*/
var app = module.exports  = express() 


//数据库model
app.set('model_LoginUser',require('../model/loginuser.js').get(comm.getMongoose(s.get('userMongo'))));

require('./auth')(app);
app.MYDIR = __dirname;
app.enable('loginhelper');//加载loginheler
require('../appconf/server')(app,express,s,comm);

//create server object
var server = require('http').createServer(app)


//*
// require routes
require('./routes/chat')(app);
require('./routes/user')(app);
require('./routes/help')(app);
require('./routes/admin')(app);
//*/

//聊天逻辑
require('./sio')(app,server,log);

//运行
app.run = function(){
	server.listen(s.get('listenPort',8880));
    require('./useronline.registry.js').start(app);
	console.log( s.bootconfig.role + " listen:",s.get('listenPort',8880));
}

if (!module.parent) {
	app.run();
}
