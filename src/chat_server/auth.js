exports.AuthHelper = AuthHelper = {
  /**
   * Authenticates a request using the login token
   * 
   * @param express request
   * @param express response
   * @param express next function
  */
	authFromCid: function(req, res, next){
		var cid = req.param('cid');
		if(!cid)
			cid = req.cookies.cid;
		if(!cid){
			res && res.redirect('/login') || res || next()
		}
		var ret  = ID.parseCid(req.cookies.cid);
		if(ret)
			var uid = ret[0];
		log.debug('authFromCid',cid,uid)
		if(ret &&  uid){
			User.findOne({ _id: + uid }, function(err, user) {
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
			} else {
				AuthHelper.authFromCid(req, res, next);
			}
	}
};
