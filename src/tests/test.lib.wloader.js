
var W = require('../lib/wloader.js')

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
    fs.writeFileSync(__dirname +'/'+ f +'.js' ,content);
}

/*
false &&  //*/
describe('wloader load',function(){
	it('testget',function(done){
		var api = new W(__dirname );
		genapif('U',2)
		api.load('U.js').login().should.eql(2);

		genapif('U',3)
		setTimeout(function(){
			api.load('U.js').login().should.eql(3);
			genapif('U','1ddd.xxx');//syntax error
			setTimeout(function(){
				done();
			},10);


		},10);
	})

});
