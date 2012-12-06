


var srcdir = '../'
,s = require(srcdir + '/lib/configservice')
,should = require('should')

process.env.BOOTFILE = __dirname + '/../../roleconf/login_server.dev.js'
var ro = require(process.env.BOOTFILE);
/*

		delete require.cache[process.env.BOOTFILE]
		var ro = require(process.env.BOOTFILE);
		s.btload('login_server.dev',function(err,o){
	      console.log('btload',o);
		  ro['role'].should.eql(s.bootconfig.role);
		 // s.lsave()
		  //for timeout

		  //process.exit(0)
		});
//var describe = describe || function(){}

if(0)
	//*/
describe('configservice', function() {
	it('#lload', function(done) {
		var f = __dirname + '/../../roleconf/login_server.dev.js'
		s.lload(f,function(err,o){
			var ro = require(f);
			//console.log(ro,o)
			ro.role.should.eql(o.role)
			ro.should.eql(o)
		    should.equal(undefined,err)
		   done();
	   })
	});
	it("test btload/save",function(){

	})
	it('test lsave ',function(done){
		done()
	})
	it('test nload /save',function(done){
		//*
		s.nload('login_server.dev',function(err,o){
	      console.log('btnload');
		  //ro.should.eql(s.bootconfig);
		  //for timeout

		  done()
		  //process.exit(0)
		});
		//*/
	})

})
