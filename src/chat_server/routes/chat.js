

module.exports = function(app,loc){
	loc = loc || '';

	var auth = app.set('myauth');


	app.get(loc + '/chat', auth.loadUser, function(req, res, next) {
		// render chat interface
		res.render('chat/index', {
			user: req.currentUser
		});
	});
}


