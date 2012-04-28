


var srcdir = '../'
,s = require(srcdir + '/lib/configservice')
,should = require('should')


		process.env.BOOTFILE = __dirname + '/../../roleconf/login_server.dev.js'
//var describe = describe || function(){}

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
	it("test btlload/save",function(){
		s.bootconfig = {};
		s.btlload();
		s.lsave();
		var ro = require(process.env.BOOTFILE);
		ro.should.eql(s.bootconfig)

	})
	it('test lsave ',function(done){
		s.btlload();
		s.nsave();
		done()
	})
	it('test btnload /save',function(done){
		//*
		s.btnload('login_server.dev',function(err,o){
	      console.log('btnload');
		  var ro = require(process.env.BOOTFILE);
		  ro.should.eql(s.bootconfig);
		  //for timeout

		  done()
		  //process.exit(0)
		});
		//*/

	})

})
