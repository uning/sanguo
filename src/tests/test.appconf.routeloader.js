
var Api = require('../appconf/routeloader.js')

var path = require('path')
,fs = require('fs')
,should = require('should');

var app = {
	set:function(k,v){
		if(v)
			app[k] =  v;
		return app[k];
	}
}
var trdir = __dirname +'/troute';
if(fs.existsSync(trdir)){
	//fs.rmdirSync(trdir,'-rf');
	//fs.mkdirSync(trdir);
}
function genapif(f,c){
	var content = " \
var " +f+ " = module.exports=function(app){ \
		app.set('"+f +"'," +c + "); \
 \
} \
	";
    fs.writeFileSync(trdir+'/' + f + '.js',content);
}

genapif('U',2)
genapif('F',3)

var api = new Api(app,'',trdir);
api.loadAll();
//*
console.log('U',app.set('U'));
console.log('F',app.set('F'));
genapif('U',1)
console.log('U',app.set('U'));
//*
		setTimeout(function(){
			console.log('U',app.set('U'));
		});

false &&  //*/
describe('appconf.routeloader',function(){
	it('testget',function(done){
		app.set('U').should.eql(2);
		genapif('U',1)
		setTimeout(function(){
			app.set('U').should.eql(1);
			done();
		});
		//next tick
	})

});
