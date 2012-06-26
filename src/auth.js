exports.AuthHelper = AuthHelper = {
  /**
   * Authenticates a request using the login token
   * 
   * @param express request
   * @param express response
   * @param express next function
*/
	authFromLoginToken: function(req, res, next) {
		var cookie = JSON.parse(req.cookies.logintoken);
		LoginToken.findOne({ email: cookie.email, token: cookie.token }, function(err, token) {
			if (!token) {
				res &&  res.redirect('/') || res || next() // for res.redirect not return res
			}else{
				User.findOne({ email: token.email }, function(err, user) {
					if (user) {
						//console.log(__filename,err,user,user.id)
						req.session = req.session || {};
						req.session.user = user;
						req.currentUser = user;
						if(res){//更新token
							//token.token = token.randomToken();//已经自动更新了
							token.save(function(){
								res && res.cookie('logintoken', token.cookieValue, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
								next();
							});
						}else{
							next();
						}
					} else {
						res && res.redirect('/login') || res || next()
					}
				});
			}
		});
	},


  /**
   * Loads the user for a request
   * 
   * @param express request
   * @param express response
   * @param express next function
   */
	loadUser: function(req, res, next) {
		if (app.set('disableAuthentication') === true){
			next();
		}else {
			if (req.session && req.session.user) {
				req.currentUser = req.session.user
				next();
			} else if (req.cookies.logintoken) {
				AuthHelper.authFromLoginToken(req, res, next);
			} else {
				res && res.redirect('/') || res || next();
			}
		}
	}
};
