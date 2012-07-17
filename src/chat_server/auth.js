exports.AuthHelper = AuthHelper = {
  /**
   * Authenticates a request using the login token
   * 
   * @param express request
   * @param express response
   * @param express next function
  */
	authFromCid: function(req, res, next) {
		var uid = ID.parseCid(req.cookies.cid);
		log.debug('authFromCid', req.cookies.cid,uid)
		if(uid){
			User.findOne({ _id: +uid }, function(err, user) {
					if (user) {
						//console.log(__filename,err,user,user.id)
						req.session = req.session || {};
						req.session.user = user;
						req.currentUser = user;
						log.debug('auth pass cid');
						next();
					} else {
						res && res.redirect('/login') || res || next()
					}
			})
		}else{
				res && res.redirect('/login') || res || next()
		}
	},


  /**
   * Loads the user for a request
   * 
   * @param express request
   * @param express response
   * @param express next function
   */
	loadUser: function(req, res, next) {
			if (req.session && req.session.user) {
				req.currentUser = req.session.user
				log.debug('auth pass session');
				next();
			} else if (req.cookies.cid) {
				AuthHelper.authFromCid(req, res, next);
			} else {
				res && res.redirect('/') || res || next();
			}
	}
};
