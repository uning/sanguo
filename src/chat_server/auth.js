
var ID = require('../lib/sessionid.js');

module.exports = function(app,loc){
	loc = loc || ''

	var auth =  {
  /**
   * Authenticates a request using the login token
   * 
   * @param express request
   * @param express response
   * @param express next function
*/
		authFromCid: function(req, res, next){

			var cid = req.query && req.query.cid;// req.param('cid');
			if(!cid)
				cid = req.body && req.body.cid;
			if(!cid)
				cid = req.cookies && req.cookies.cid;
			if(!cid){
				log.debug('authFromCid no cid')
				res && res.redirect( loc + '/login') || res || next()
				return;
			}
			var ret  = ID.parseCid(req.cookies.cid);
			if(ret)
				var uid = ret[0];
			log.debug('authFromCid',cid,uid)
			if(ret &&  uid){
				var LoginUser = app.set('model_LoginUser');
				LoginUser.findOne({ _id: + uid }, function(err, user) {
					if (user) {
						//console.log(__filename,err,user,user.id)
						req.session = req.session || {};
						req.session.user = user;
						req.currentUser = user;
						log.debug('auth pass cid');
						next();
					} else {
						res && res.redirect( loc + '/login') || res || next()
					}
				})
			}else{
				res && res.redirect(loc + '/login') || res || next()
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
				this.authFromCid(req, res, next);
			}
		}
	}
	app.set('auth',auth);
}
