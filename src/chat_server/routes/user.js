
var ID = require('../../lib/sessionid.js');
/**
 * route 添加
 *
 * @param app {express}
 * @param loc {String} 挂载位置,默认为空
*/
module.exports = function(app,loc){
	loc = loc || '';

	var auth = app.set('myauth');
	var log = app.set('mylog');
	var LoginUser = app.set('model_LoginUser');
	var Admins = app.ADMINS;

	app.get('/test',function(req,res){
		res.send(app.Admins);
	})
	// login form route
	app.get(loc + '/',function(req, res) {
		auth.sessionAuth(req,null,function(){
			if(req.currentUser) {
				res.render('index', {
					user: req.currentUser
				});
				return;
			}
			//*/
			res.render('user/login', {
				user: {}
			});
		});
	});

	// login route
	app.post(loc +'/', function(req, res) {
		var post = req.body
		if(!post || !post.user ){
			req.flash('error', 'Login failed 没有输入用户名或密码 ');
			res.redirect(loc + '/');
			return;
		}
		Admins = app.ADMINS;
		var user = Admins[post.user.email];
		if(user && user.pass == post.user.password){
			req.session && (req.session.currentUser = user)
			var cid =  ID.genCid(post.user.email,'s1');
			res.cookie('cid',  cid , { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
			res.redirect(loc + '/');
			return;
		}

		LoginUser.findOne({ pid: req.body.user.email }, function(err, user) {
			if (user ) {
				if(! user.authPass(req.body.user.password)){
					req.flash('error', 'Login failed password error ');
					res.redirect(loc + '/');
				}else{
					req.session && (req.session.currentUser = user)
					var cid =  ID.genCid(user.id,'s1');
					res.cookie('cid',  cid , { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
					res.redirect(loc + '/');

					log.info('login',user,cid);
				}
			} else {
				req.flash('error', 'Login failed user not exist' + err);
				res.redirect(loc + '/');
			}
		});
	});

	//logout user
	app.get( loc + '/logout', auth.sessionAuth, function(req, res) {
		if (req.session) {
			res.clearCookie('cid');
			req.session.destroy(function() {});
		}
		res.redirect(loc  + '/');
	});

	// register form route
	app.get( loc + '/register', function(req, res) {
		res.render('user/register', {
			register: new LoginUser
		});
	});


	// create user route
	app.post(loc + '/register', function(req, res) {
		if(!Admins[req.body.register.email]){
			req.flash('error', '该邮件地址限制注册，请使用@playcrab.com邮箱!');
			res.render('user/register', {
				register: req.body.register
			});
			return;
		}else if (req.body.register.password != req.body.password_verify) {
			req.flash('error', '两次输入密码不匹配!');
			res.render('user/register', {
				register: req.body.register
			});
			return;
		}

		var pid =  req.body.register.email;
		LoginUser.findOne({ pid: pid }, function(err, user) {
			if (user) {
				req.flash('error', 'E-Mail address already registred!');
				res.render('user/register', {
					register: req.body.register
				});
			}else{
				var initdata = {pid:pid,email:pid,_password:req.body.register.password};
				LoginUser.genid(pid,initdata,function(err,id,isNew,uo){
					log.debug('register genid pid ',err,pid,id,uo);
					if (err) {
						req.flash('error', 'Error while saving your registration!' + err);
						res.render('user/register', {
							register: uo 
						});
					}else{
						req.session.currentUser = uo;
						uo.name = 'GM';
						req.flash('info', 'Registration successful');
						res.cookie('cid',ID.genCid(id,'s1'), { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
						res.redirect(loc + '/');
					}
				});
			}
		});
	});
}
