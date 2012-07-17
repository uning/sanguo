

var srcdir = '../'
,mongodb = require('mongodb')
,mongoose = require('mongoose')
,util = require('util')
,comm = require(srcdir + 'common')
,should = require('should')
,s = require(srcdir + '/lib/configservice')
process.env.BOOTFILE = __dirname + '/../../roleconf/login_server.dev.js'



describe('common', function() {
	it('getLogger', function() {
		var a = comm.getLogger('a')
		var b = comm.getLogger('b')
		var aa = comm.getLogger('a')
		a.should.eql(aa)
		b.should.not.eql(a)
		a.info('a info')
		a.debug('b debug')
		aa.debug('aa debug')
		b.info('b info')
		b.debug('b debug')

	});
	it('getRedis',function(done){
		s.btload();
		var constr = s.bootconfig.cacheserver;
		var r = comm.getRedis(constr); 
		var r1 = comm.getRedis(constr); 
		r1.should.eql(r);
		var k = 1,v = 'it val of ' + k
		r.set(k, v, function(){
			r.get(k,function(err,d){
				console.log(constr,' get' , k ,'=',d,'  err:',err)
				d.should.eql(v)
				done();
			})
		});
		r1.freeme();



	})
	it('getCache',function(done){
		s.btload();
		var r = comm.getCache(); 
		var k = 1,v = 'it val of ' + k
		r.set(k, v, function(){
			r.get(k,function(err,d){
				console.log('cache  get' , k ,'=',d,'  err:',err)
				d.should.eql(v)
				done();
			})
		});
		r.freeme();



	})


})

