
var json = require('commonjs-utils/lib/json-ext')
,express = require('express')


var chatsio  = module.exports = function(app,loc){
	loc = loc || '';

	var auth = app.set('myauth');
	var LoginUser = app.set('model_LoginUser');
	var uor = require('./useronline.registry') //用户列表 
	var sio =  require('socket.io').listen(app.set('myserver'));
	sio.log = app.set('mylog');

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
		//sio.set('heartbeat timeout',s.get('heartbeat timeout',30));
		//sio.set('heartbeat interval',s.get('heartbeat interval',40));
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
				auth.sessionAuth(handshake,null,function(){
					if(handshake.currentUser){
						u = handshake.currentUser.id;
						next(null, true);
						uname = handshake.currentUser.name || handshake.currentUser.email
						handshake.user = uor.addUser(u,uname)
						log.debug('cookie handshake ok ',handshake.user.id)
					}else{
						next(null, false);
						log.warn('cookie handshake error : no userid',handshake)
					}
				});
			});

/*
		 findDatabyIP(handshake.address.address, function (err, data) {
			 if (err) return callback(err);

			 if (data.authorized) {
				 handshake.foo = 'bar';
				 for(var prop in data) handshake[prop] = data[prop];
				 callback(null, true);
			 } else {
				 callback(null, false);
			 }
		 })
*/
		})
	});

/**
 * 处理聊天逻辑
 *
*/
	sio.sockets.on('connection', function(socket) {
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
		user.login();//表示长连接成功



		//加载处理器
		//socket.emit('eventnme',param) 产生事件
		//socket.send(message) 产生message,可以为json object 或字符串
		socket.on('online', function(m, c) {
			if( m && m.ids){
				var len = m.ids.length,om = {},id,u;
				for(var i = 0; i< len ;i++){
					id = m.ids[i];
					u = uor.getUser(id);
					if(u && u.socket){
						om[id] = 1;
					}else
						om[id] = 0;
				}
				socket.emit('online',om)
			}

		});
		//最近消息
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

		socket.on('message', function(m, c) {
			var user = socket.handshake.user;
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
			msg.t = msg.t || 0;
			var omsg = {_fid:user.id,_fn:user.n,_t:new Date().getTime(),c:msg.c,t:msg.t}
			//socket.emit('message',omsg)
			switch (msg.t) {
				case 1:
					case 3:
					case 4:
					//
					socket.broadcast.emit('message',omsg)
				break;
				case 2: // 公会聊天
					break;
				default: //玩家一对一或1对多聊天
					var toids = msg.to,touser
				if('all' === toids){
					omsg.t = 1;
					socket.broadcast.emit('message',omsg)
				}else if( typeof '1' === typeof toids || typeof 1 === typeof toids  ){
					touser = uor.getUser(toids);
					touser && touser.tome(omsg) || uor.offlineMsg(toids,omsg) 
				}else if(typeof toids === typeof []){
					var unum = toids.length
					for(var i = 0 ;i < unum ; i ++){
						touser = uor.getUser(toids[i]);
						touser && touser.tome(omsg) || uor.offlineMsg(toids[i],omsg);
					}
				}else{
					log.warn('no `t` ignore',user.id,m);
				}
			}
		});

		socket.on('disconnect', function(c) {
			//uor.removeUser(socket.handshake.userid);
			log.info('disconnect:',c,socket.handshake.user.id)
			var user = socket.handshake.user;
			user.s  = 2;// offline
			user.socket = null;
		});


	});

	return sio;
}

