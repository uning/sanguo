
/**
 * route 添加
 *
 * @param app {express}
 * @param loc {String} 挂载位置,默认为空
 */
module.exports = function(app,loc){
	loc = loc || '';

	var auth = app.set('myauth');
	var log  = app.set('mylog');
	var uor = require('../useronline.registry.js');//用户列表 

	// login form route
	app.get(loc + '/admin/useronline',auth.loadUser,function(req, res) {
		log.debug('params:',req.params); 
		log.debug('qurery:',req.query); 
		res.render('admin/useronline', {
			uor: uor
			,users: uor.getPage()
			,user: req.currentUser
		});
	});

	app.get('/routes',function(req,res){
		res.send(200,app.routes);
	})


	// login form route
	app.get(loc + '/admin/banusers',auth.loadUser,function(req, res) {
		res.render('admin/banusers', {
			user: req.currentUser
		});
	});





	app.get(loc + '/admin/sysnotice',auth.loadUser,function(req, res) {
		res.render('admin/sysnotice', {
			user: req.currentUser
		});
	});
}
