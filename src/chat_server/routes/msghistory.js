



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

	var _ = require('underscore');
	var s = app.CONFIG;
	var comm = require(s.WORKROOT + '/src/common.js')
	var sec = s.get('sec');
	if(s.get('msgMongo',null) == null ){
		smongo = null;
	}else{
		smongo = require( s.WORKROOT  + '/src/model/chatmsg.js').get(comm.getMongoose(s.get('msgMongo'),sec + '_msgs'));
	}

	// login form route
	app.get(loc + '/msghistory',auth.loadUser,function(req, res) {
		log.debug('params:',req.params); 
		log.debug('qurery:',req.query); 
		var start = req.query.from || 0;
		var filt = req.query.filt || 0;
		var limit = req.query.limit || 20;
		var to =  (+start) + (+limit);
		var cond = {}
		if(filt)
			cond._filt = 1;
		log.debug('msghistory cond',cond);
		if(smongo){
			smongo.find(cond).sort({'$natural':-1}).skip(start).limit(limit).exec(
				function(err,msgs){
				//console.log(msgs);
				if(err){
					res.render('msghistory', {
						smongo: null
						,user: req.currentUser
						,to:to
						,filt:filt
					});
				}else{
					var nmsgs = []
					_.each(msgs,function(msg){
						var m = msg.toObject();
						/*{
							_fn:msg._fn,
							_fid:msg._fid,
							c:msg.c,
							t:msg.t,
							to:msg.to,
							_t:new Date(msg._t)
						}
						*/
						m._t = new Date(m._t);
						nmsgs.push(m);
						//console.log(m,msg,msg._fid);

					})
					res.render('msghistory', {
						smongo: true
						,user: req.currentUser
						,users:nmsgs
						,to:to
						,filt:filt
					});
				}
			})
		}else{
			res.render('msghistory', {
				smongo: null
				,user: req.currentUser
				,to: to
				,filt:filt
			});
		}
	});

}
