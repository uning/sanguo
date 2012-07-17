
var srcdir = '../'
,php = require(srcdir + 'lib/php')
,should = require('should')

var redis = require("redis"),
rc = redis.createClient(53002,'127.0.0.1');
rc.on("error", function (err) {
	console.log("Redis Error " + err);
});


describe('php', function() {
	it('serialize', function() {
		var data = {a:5,b:3,c:[1,2,3]};
		var s = php.serialize(data);
		console.log(s);
		php.unserialize(s).should.eql(data)
	});
	it('session_encode/session_decode',function(done){
		var uid = '1s1';
		rc.get(uid,function(err,d){
			var  ud = php.unserialize(d);
			var o = php.session_decode(ud);
			console.log(err,d,ud,o)
			done()
		})

	})

})
