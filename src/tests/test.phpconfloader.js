

var L = require('../lib/phpconfloader.js')
l = new L('/home/hotel/ares/config/master/');
var file = '/home/hotel/ares/config/master/dizitupo.php';
l.loadAll();

l.get('dizitupo',1,function(err,data){
	console.log(err,data);
})
false && 
l.load(file,function(err,jso){
	//console.log(l);
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
