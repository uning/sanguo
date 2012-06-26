

// login form route
app.get('/help',auth.loadUser, function(req, res) {
	var markdown = require('markdown').markdown,fs = require('fs')
	var md = fs.readFileSync(app.set('views') + '/readme.md','utf-8')
	md = markdown.toHTML(md)
  if (req.session) {
      res.render('help', {
        locals: {
          user: req.currentUser
		  ,helpContent:md
        }
      });

	  /*
      var markdown = require('markdown').markdown,fs = require('fs')
	   fs.readFile(app.set('views') + '/readme.md',function(err,data){
		   if (err) {
			   throw err;
		   }
		   md = data.toString('utf8');
		   res.send(
			   markdown.toHTML(md)
		   );
	   });
	   */
  }else
	  res.send('please login to see');
});

