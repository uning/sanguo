

/**
 * route 添加
 *
 * @param app {express}
 * @param loc {String} 挂载位置,默认为空
*/
module.exports = function(app,loc){
	var ID = require(app.CONFIG.WORKROOT+'/src/lib/sessionid.js');
	var fs = require('fs');
	var Apiloader = require(app.CONFIG.WORKROOT + '/src/appconf/apiloader.js');

	//
	var apiloader = new Apiloader(__dirname +'/api');

	var es = {
		restrict:'restrict'
		,nomethod:'nomethod'
		,noparam:'noparam'
		,nohandler:'nohandler'
	};
	loc = loc || '';

	var auth = app.set('myauth');
	var log = app.set('mylog');
	var LoginUser = app.set('model_LoginUser');
	var Admins = app.set('model_Admins');

	




	app.get(loc + '/api',function(req, res) {
		res.send(200,{s:es.restrict})
	});


	//api
	app.post(loc +'/api', function(req, res) {
		var m = req.query.m
		if(!m)
			m = req.body.m
		if(!m){
			res.send(200,{s:es.nomethod,m:m})
		}
		var mcb = apiloader.get(m);
		if(!mcb){
			res.send(200,{s:es.nohandler,m:m})
			return;
		}
		mcb(req,res);

	});

}
