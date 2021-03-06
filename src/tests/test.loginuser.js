



var srcdir = '../'
,comm = require(srcdir + 'common.js')
,util = require('util')
,s = require(srcdir + 'lib/configservice.js')
,ls = require(srcdir + 'model/loginuser.js')
,should = require('should')

process.env.BOOTFILE = __dirname + '/../../roleconf/login_server.dev.js'
s.bootconfig = require(process.env.BOOTFILE)//s.btload()
//var describe = describe || function(){}
uri = s.bootconfig.dbserver;
uri = s.bootconfig.confserver;
uri = 'mongodb://localhost:35050/test'

var mc = comm.getMongoose(uri)
var m  = ls.get(mc,'jsuser') 


var id = 1,pid = 'testpid'
if(  1 )
describe('loginuser', function() {
	it('CommonPlugin  fam',function(done){
		var nid = 2 
		m.fam({
			query:{_id:nid}
			,update:{'$set':{name:'tingkun'},'$inc':{cc:6}}
		},function(err,o){
			//console.log(err,o);
			o.get('cc').should.be.a(typeof 6);
			should.not.exist(err);
			o.name.should.eql('tingkun');
			done();
		})
	});
	it('genid',function(done){
				
		m.far({query:{pid:pid}},function(err,u){
			should.not.exist(err);
			m.far({query:{_id:'igen_incid'}},function(err,u){ //删除测试数据
				should.not.exist(err);
				var pid = 'test1111';
				m.genid(pid,{name:'name of ' + pid},function(err,nid,isNew,u){
					//console.log(err,nid,isNew,u);
					should.not.exist(err);
					nid.should.eql(id)
					//should.strictEqual(isNew,true)
					done();
				});
			})
		});


	})

	it('obj2model', function(done) {
		var now = new Date().getTime();
		var nf = 'newfield' + now ,nv = 'newvale' + now

		
		var uo = m.obj2model({pid:'testuser1'},id);
		uo.set(nf, nv);
		uo.set('name', '廷坤');
		uo.save(function(err,o){
			if(err)
				console.log('uo.save',o,err)
			m.findOne({_id:id},function(err,u){
				if(err)
					console.log('uo.save m.findOne ',nf,u,err)
				if(u)u.get(nf).should.eql(nv) 
					done()
			})
		});
	});

	it('find and modify, fam', function(done){
		m.fam({query:{_id:id}
			  ,update:{'$set':{'name':'tingkun'},'$inc':{counter:1}}
		},function(err,o){
			if(err)
				console.log('fam',o,err)
			if(o){
				var ff; 
				o.set(ff = 'newf' + new Date().getTime(),ff)

				console.log('fam',o._doc._id,err)


				o.save(function(err,u){
					if(err)
						console.log('fam o.save ',u ,err)
					else{
						u.get(ff).should.eql(ff);
						//u.get('counter').should.eql(1);
					}
					done();
				});
			}else
				done();
		})
	});

	it('fam obj2model, dot path ', function(done){
		var um = m.obj2model({_id:id});
		um.numch('money',1)
		um.opOne('its.me','itsme')
		um.dbcommit(function(err,u){
			console.log(err,u,u.get('its.me'))
			done();
		})
	

	});
	it('fam after far (new record)', function(done){
		m.far({_id:id},function(){
			m.fam({query:{_id:id}
				  ,update:{'$set':{'name':'tingkun'},'$inc':{counter:1}}
			},function(err,o){
				console.log(o,err)
				//if(o)o.get('name').should.eql('tingkun')
				done()

			});
		});

	});
	it('fam after fam (old record)', function(done){
		m.fam({query:{_id:id}
			  ,update:{'$set':{'name':'tingkun'},'$inc':{counter:1}}},function(err,o){
			m.fam({query:{_id:id}
				  ,update:{'$set':{'name':'tingkun'},'$inc':{counter:1}}},function(eerr,eo){
				eo.get('counter').should.eql(o.get('counter') + 1);
				done()
			});
		});

	});

	it('numch opOne commit', function(done){
		m.fam({query:{_id:id}
			  ,update:{'$set':{'name':'tingkun'}}},function(err,o){
				  if(err)
					  console.log(o,err)
				  o.numch('newc',1);
				  o.opOne('newobj',{a:1232})
				  o.dbcommit(function(err,oo){
					  console.log('dbcommit',err,oo)
					  done()
				  })
			  });
	});


	/*
    //*/
	

})






