

module.exports = function(app,loc){
	loc = loc || '';
	var auth = app.set('myauth');
	// login form route
	app.get(loc + '/help',auth.loadUser, function(req, res) {
		var markdown = require('markdown').markdown,fs = require('fs')
		var md = fs.readFileSync(app.set('views') + '/readme.md','utf-8')
		md = markdown.toHTML(md)
		if (req.session) {
			res.render('help', {
				user: req.currentUser
				,helpContent:md
			});

		}else
			res.send('please login to see');
	});
}

