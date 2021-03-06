
var json = require('commonjs-utils/lib/json-ext')
,express = require('express')


var chatsio  = module.exports = function(app,loc){
	loc = loc || '';

	var auth = app.set('myauth');
	var LoginUser = app.set('model_LoginUser');
	var uor = require('./useronline.registry') //用户列表 
	var sio =  require('socket.io').listen(app.set('myserver'));
	var s = app.CONFIG;

	var log = sio.log = app.set('mylog');
        sio.set('logger',log);


	//sio.set('log level',s.get('loglevel','debug'));

	//confiure socket io
	//https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO

	sio.configure(function(){
		sio.enable('browser client etag');
		sio.set('transports', [
				'websocket'
				, 'flashsocket'
				, 'htmlfile'
				, 'xhr-polling'
				, 'jsonp-polling'
		]);
		var timeout = s.get('heartbeats',false);
		if(!timeout)
			sio.set('heartbeats',false);
		else{
			sio.set('heartbeat interval',timeout)
			sio.set('heartbeat timeout',2*timeout);
			sio.set('close timeout',2*timeout + 1)
		}
	});


	sio.configure( function(){
		var cookieParser = express.cookieParser();
		//处理连接，ip 封禁
		//根据cid 处理 等 
		sio.set('authorization', function(handshake, next) {
			//console.log('handshake',handshake);
			if(handshake.user){
				next(null, true);
				log.info('handshake address, has user',handshake.address);
				return ;
			}
			cookieParser(handshake,null,function(){
				var u,uname
				log.info('handshake address',handshake.address);
				auth.cidAuth(handshake,null,function(){
					var authinfo = handshake._auth;
					if(handshake._auth){
						u = authinfo.uid;
						next(null, true);
						uname = authinfo.name || 'GM-' + authinfo.uid
						handshake.user = uor.addUser(u,uname)
						log.debug('cookie handshake ok ',handshake.user.id)
					}else{
						next(null, false);
						log.warn('cookie handshake error : no userid',handshake)
					}
				});
			});

		})
	});

  /**
   * 处理聊天逻辑
   *
   */
	sio.sockets.on('connection', function(socket) {
		uor.siosock = socket;
		if(!socket.handshake){
			log.warn('no handleshake')
			socket.close();
			return;
		}
		if(!socket.handshake.user){
			log.warn('no user',socket.handshake)
			socket.close();
			return;
		}
		var user = socket.handshake.user;

		user.lastseen = new Date();
		if(user.socket){ //
			//	user.socket.close();// 重复登录
		}
		user.socket = socket;
		log.info('connection:',user.n,user.id)

		//处理系统通知
		// socket.broadcast.emit('login', { n: user.n,id:user.id});
		// user.login();//表示长连接成功

		//离线最近消息
		socket.on('recentm', function(m, c) {
			var user = socket.handshake.user;
			var callb = function(err,data){
				if(err){

				}
				else{
					socket.emit('recentm',{msgs:data})
				}
			}
			user.getRecentMsgs(callb)
		});

		//最近广播的消息
		socket.on('brecentm', function(m, c) {
			socket.emit('brecentm',{msgs:uor.getAllRecentMsgs()})
		});

		socket.on('message', function(m, c) {
			var user = socket.handshake.user;
			if(user.isban){
				socket.emit('message',{_fid:1,_fn:'系统',c:'你已被禁言，请联系GM'});
				return;
			}
			user.lastseen = new Date();
			log.debug('message:',m,socket.handshake.user.id,c)
			// parse message
			var msg = m || {};
			if(typeof m == 'string'){
				try{
					msg = json.parse(m)
				}catch(e){
					log.warn('message from '+socket.handshake.username +'invalid ',m);
					return;
				}
			}

			//socket.broadcast.send(m);//just
/*
	### *消息定义*
	{
	 t: 1,     //消息类型 1 -世界聊天，2- 公会聊天，3 系统，4 系统通知，默认0 玩家一对一或1对多聊天
	 to: [],   //接收者id列表, 几个特殊的 ALL --所有 
	 c:''      // 消息内容        
	}
*/
			msg._fid = user.id;
			msg._fn = user.n;
			uor.processMessage(msg,socket);

		});

		socket.on('disconnect', function(c) {
			log.info('disconnect:',c,socket.handshake.user.id)
			var user = socket.handshake.user;
			user.s  = 2;// offline
			user.socket = null;
		});

	});
	return sio;
}

