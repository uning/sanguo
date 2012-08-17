
var uor = require('../useronline.registry.js');//用户列表 
/**
 * route 添加
 *
 * @param app {express}
 * @param loc {String} 挂载位置,默认为空
 */
module.exports = function(app,loc){
	loc = loc || '';

	var auth = app.set('myauth');
	// login form route
	app.get(loc + '/admin/useronline',auth.loadUser,function(req, res) {
		log.debug('params ',req.params); 
		res.render('admin/useronline', {
			uor: uor
			,users: uor.getPage()
			,user: req.currentUser
		});
	});


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
