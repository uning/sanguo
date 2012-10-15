
var ID = require('../lib/sessionid.js');
module.exports = function(app,loc){
	loc = loc || '';

	var LoginUser = app.set('model_LoginUser');
	var log = app.set('mylog');

	var auth = {
  /**
   * 根据cid验证用户，是否登录
   * 不从数据库读取用户
   *
   * 解析完成后，在
   * req._auth.uid  //用户登录id
   * req._auth.sec  //用户登录分区 
   * req._auth.lt   //登录时间
   * 
   * 
   * @param express request
   * @param express response
   * @param express next function
*/
		cidAuth: function(req, res, next) {
			var cid = req.query && req.query.cid;// req.param('cid');
			if(!cid)
				cid = req.body && req.body.cid;
			if(!cid)
				cid = req.cookies && req.cookies.cid;
			if( cid == null ){
				next('not get cid');
				return;
			}


			var rr	= ID.parseCid(cid);
			if(!rr){
				next('cid parse error');
				return;
			}
			req._auth = req._auth || {};
			req._auth.uid = rr[0] //用户登录id
			req._auth.lt  = rr[1]   //登录时间
			req._auth.sec = rr[2] //用户登录分区 
			req._auth.name =  req.query.name ;
			next()
		}

	/**
	 * authAndLoad
     */
		,sessionAuth:function(req,res,next){
			if (req.session && req.session.currentUser) {
				req.currentUser = req.session.currentUser
				log.debug('auth pass session');
				next();
			}else{
				var mynext  = function(err){
					if(err){
						next(err);
					}else{
						var authinfo = req._auth;
						LoginUser.findOne({ _id: + authinfo.uid }, function(err, user) {
							if (user) {
								//console.log(__filename,err,user,user.id)
								req.session = req.session || {};
								req.session.currentUser = user;
								req.currentUser = user;
								

								log.debug('auth pass cid');
								next();
							} else {
								res && res.redirect(loc + '/login') || res || next()
							}
						})
					}
				}
				auth.cidAuth(req, res, mynext);
			}
		}
		,loadUser: function(req, res, next) {

			auth.sessionAuth(req,res,next);
		}
	};

	app.set('myauth',auth);
	return auth;
};
