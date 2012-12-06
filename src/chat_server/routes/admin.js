

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
	var uor = require('../useronline.registry.js');//用户列表 

	// login form route
	app.get(loc + '/admin/onlinecnt',auth.loadUser,function(req, res) {
		var now = new Date().getTime()
		var gap = req.query.gap || 300;
        gap = (+gap)*1000;
        
        var totalsocket = 0,total = 0;
		for(id in uor._currentUsers){
			u = uor._currentUsers[id]
			//if(u.lastseen.getTime() + gap > now){
            if(u.socket ){
              totalsocket += 1;
			}
            total +=1;

		}
        res.send("user entry: " + total + ", socket cnt: " + totalsocket);
	});
	// login form route
	app.get(loc + '/admin/useronline',auth.loadUser,function(req, res) {
		log.debug('params:',req.params); 
		log.debug('qurery:',req.query); 
		var start = req.query.from || 0;
                var limit = req.query.limit || 20;
                var to =  (+start) + (+limit);
               
		res.render('admin/useronline', {
			uor: uor
                        ,to: to
			,users: uor.getPage(start, to)
			,user: req.currentUser
		});
	});

	app.get('/routes',function(req,res){
		res.send(200,app.routes);
	})


	//login form route
	app.all(loc + '/admin/banusers',auth.loadUser,function(req, res) {
		var uid = req.query && req.query.banuid 	
		if(!uid)
			uid = req.body && req.body.banuid;
		if(uid){
			var uo = uor.getUser(uid);
			var ban = 1;
			if(uo){
				ban = uo.isban = uo.isban ? 0: 1;
			}
			uor.ban(ban,uid);
			msg = uid + " user.isban is " + uo.isban;
			req.flash('error',msg);
		}else{
			uid = ''
		}
		res.render('admin/banusers', {
			user: req.currentUser
			,banuid:uid
		});
	});




	//login form route
	app.all(loc + '/admin/clearrmsgs',auth.loadUser,function(req, res) {
		uor.clearrmsgs();
		res.send('清除记录OK')
	});


	app.get(loc + '/admin/sysnotice',auth.loadUser,function(req, res) {
		res.render('admin/sysnotice', {
			user: req.currentUser
		});
	});
}
