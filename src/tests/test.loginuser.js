



var srcdir = '../'
,comm = require(srcdir + 'common.js')
,s = require(srcdir + 'lib/configservice.js')
,ls = require(srcdir + 'model/loginuser.js')
,should = require('should')







process.env.BOOTFILE = __dirname + '/../../roleconf/login_server.dev.js'
s.btlload()
//var describe = describe || function(){}
var uri = 'mongodb://localhost:35050/test'
uri = s.bootconfig.loginmongodb;
var mc = comm.getMongoose(uri)
var m  = ls.get(mc,'user') 
uri = s.bootconfig.confserver;

function doanother_connection(){
	uri = 'mongodb://122.11.61.27:35050/test'
	var mc1 = comm.getMongoose(uri)
	var m1 = ls.get(mc1,'user')
	m1.findOne({},function(err,o){
		console.log(util.inspect(o),err)
	})
}


var id = 1,now = new Date().getTime();
var nf = 'newfield' + now ,nv = 'newvale' + now
uo = m.obj2model({_id:id,pid:'testuser1'});
uo.set(nf, nv);
uo.save(function(err,o){
	m.findOne({_id:id},function(err,u){
		console.log('uo.save findOne ',nf,u,err)
		u.get(nf).should.eql(nv) 
	})
    console.log('uo.save',o,err)
});
m.fam({query:{_id:1}
	  ,update:{'$set':{'name':'tingkun'},'$inc':{counter:1}}
	  //,fields:[]
     },function(err,o){
	console.log('fam',o,err)
	if(o){
		o.set('newf' + new Date().getTime(),12312)
		console.log('fam create_at ',o.create_at)
		o.save(function(err,u){
			console.log('fam o.save ',u ,err)
		});
	}


})
//*/

m.findOne({_id:1},function(err,o){
	console.log('findOne',o,o._id,err)
	if(o){
		console.log(o.create_at)

	}
})






