
var ID = require('../../lib/sessionid.js');
var fs = require('fs');
/**
 * route 添加
 *
 * @param app {express}
 * @param loc {String} 挂载位置,默认为空
*/
module.exports = function(app,loc){
	loc = loc || '';

	var auth = app.set('myauth');
	var log = app.set('mylog');
	var LoginUser = app.set('model_LoginUser');
	var Admins = app.set('model_Admins');

	//api逻辑，可以重新加载
	fs.watch(__dirname+'/api',function(fw,file){
		
	});
	


	app.get(loc + '/api',function(req, res) {
		res.send(200,'restrict access')
	});

	//api
	app.post(loc +'/api', function(req, res) {
		var m = req.query.m
		if(!m)
			m = req.body.m
		auth.cidAuth(req,null,function(err){
			if(err){
				res.json({s:'auth',redirect:''})
			}else{
				//
				res.json({s:'OK',redirect:''})
			}
		})

	});


}
