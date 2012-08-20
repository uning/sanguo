
var Api = require('../appconf/apiloader.js')

var path = require('path')
,fs = require('fs')
,should = require('should');

function genapif(f,c){
	var content = " \
var " +f+ " = module.exports={ \
	login:function(req,res,next){ \
		return "+c+"; \
 \
	} \
} \
	";
    fs.writeFileSync(__dirname +'/'+ f + '.js',content);
}

/*
false &&  //*/
describe('appconf.api',function(){
	it('testget',function(done){
		var api = new Api(__dirname );
		genapif('U',2)
		api.get('U.login')().should.eql(2);

		genapif('U',3)

		//next tick
		setTimeout(function(){
			api.get('U.login')().should.eql(3);
			done();
		});
	})

});
