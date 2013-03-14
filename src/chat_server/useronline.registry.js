
/**
 *
 * 内存数据,所有连接的玩家
 *
 *  使用redis 记录用户登录
 *
 *
 * 不同连接用户间通信：
 *   跨服务器永用户聊天,分区
 *    $servername:crossschat -- channel
 *   聊天服务器收到后,找相关用户是否在线,发送信息
 *  
 *
 *   
 * 
*/

// get required modules
var libdir = '../lib/'
,s = require(libdir + 'configservice.js')
,comm = require(s.WORKROOT + '/src/common.js')
,LL  = require( libdir + 'linkedlist.js')


var json = require('commonjs-utils/lib/json-ext')
,base64 = require('commonjs-utils/lib/base64')


//发消息到聊天服务器的连接
var  rc ;//redis client


var smongo  ; //存消息的mongodb

//服务器表示，分区，string
var server,sec,llnum;


var log = comm.getLogger('uor'); 

ChatUser = function(){
	this._t = new Date();
	this._rmsgs = []
}



/**
 * 获取数据
*/
ChatUser.prototype.init = function(){
	var that = this,id=this.id,uname
	if(24 ===  id.length)
		id = new mongoose.Types.ObjectId(id)
	else{
		id = parseInt(id) ; //toint 
	}
	var mid = 'ban:'+ this.id
	rc.get(mid,function(err,res){
		if(!err){
			if(+res == 1)
				that.isban = 1;
		}
		log.debug('ChatUser.init ' + mid,res,'isban='+ that.isban,err);
	});

	/*获取名字及好友列表
	LoginUser.findById(id,function(err,user){
		if(user){
			that.fids = user.fids || []
			uname = uname || user.name ||  user.pinfo && user.pinfo.name || user.session && ( user.session.name || user.session.pid) 
			if(uname){
				user.n = uname
			}
			//log.debug('init ChatUser ok',user)
		}
		else{
			log.error('init ChatUser failed',id)
		}
	})
    */
}

ChatUser.prototype.getRecentMsgs = function(callback){
	var mid = 'msg:' + sec + ':'+ this.id
	var old = new Date().getTime() - 86400*1000*1;

	rc.lrange(mid,0,-1,function(err,res){
		log.debug(mid ,' recent msg from redis:',res,err);
		if(err){
			log.error('get recent messages failed ',err)
			callback(err,data);
		}else{
			var rmsgs = [],mo
			for(var i = 0; i < res.length || i > 20; i++ ){
				try{
				mo = json.parse(res[i]);
				if(mo && mo._t  > old)
					rmsgs.push(mo);
				}catch(e){}
			}
			callback(null,rmsgs);
		}
	})
}


/**
* 向redis 服务器注册
*/
ChatUser.prototype.login = function(){

	return;
	var mid = 'msg:'+ this.id
	,multi = rc.multi()
	,a
	,rmsgs = this._rmsgs
	,i;

	multi
	.sadd(server +":" + sec + ':onlineusers',this.id)
	.hset('user2server',this.id,server)
	.set('info:'+this.id,json.stringify({lastseen:this.lastseen,server: server,systime:this.systime}))
	.exec(function(err,r){
		if(err){
			log.error('ChatUser connect store error',err,r)
		}
	});
}

/**
 * 接收一条消息,保留最近聊天记录
 * 存放到redis列表
*/
ChatUser.prototype.tome = function(msg){
	var strmsg = msg,rmsgs = this._rmsgs
	if(this.socket){
		this.socket.emit('message',msg)
		return; //wether to save history
		rmsgs.push(msg);
		if(rmsgs.length > 50){
			rmsgs.pop();
		}
	}

	//离线消息
	var mid = 'msg:' + sec + ':'+ this.id;
	var multi = rc.multi();
	if('string' !== typeof msg)
		strmsg = json.stringify(msg);
	multi
	.lpush(mid,strmsg)
	.llen(mid,function(err,res){
		if(res.length > 10)
			multi.rpop(mid)
	})
	.exec(function(err,r){
		if(err){
			log.error('ChatUser connect store error',err,r)
		}
	});
}


/**
 *
 */
var uor = {
	_currentUsers: {},
	_currentGroups: {}, //群
	_banUsers:{},

	siosock:null, //广播时候用

	_rmsgs:new LL, //最近消息
	clearrmsgs:function(){
		uor._rmsgs = new LL;
	},
	


	addRecentMsg:function(m){
		var ll = this._rmsgs;
		ll.rpush(m);
		if(ll.size() > llnum){
			ll.lpop();
		}
	},
	getAllRecentMsgs:function(){
		return this._rmsgs.toArray();
	},
	/** 
	 * 初始化封禁用户列表等
	 *
     */
	init:function(){

	},


  /**
   * 用户连接聊天服务器时时调用
   * 记录用户登录时间
  */
	addUser: function(userid,username,state,socket) {
		user = this._currentUsers[userid] || new ChatUser()
		user.n = username;
		user.s = state || 1;
		user.id = userid;
		user.socket = socket;
		this._currentUsers[userid] = user
		user.init();
		return user;
	},

	/**
	 * 清理断开的用户,默认半小时 
     */
	clearTimeOutUser:function(t){
		log.info('do clearTimeOutUser ...');
		var to = t || 3600000,now = new Date().getTime(),u
		for(id in this._currentUsers){
			u = this._currentUsers[id]
			if(u.lastseen.getTime() + to < now){
				delete  this._currentUsers[userid];
				log.debug('clearTimeOutUser:',u)
			}

		}
		log.info('do clearTimeOutUser end');

	},

	ban : function(r,uid){
		var mid = 'ban:'+ uid
		rc.set(mid,r,function(){
		});
	},
	/**
	 * 离线消息存储
*/
	offlineMsg:function(touid,msg){
		var uo = new ChatUser();
		uo.id = touid;
		uo.tome(msg);
		//log.warn('offlineMsg: to ',uid,' from ',msg._fid)

	},


  /**
   *
   * 用户断开连接时调用
   *
*/
	removeUser: function(userid) {
		if (userid in this._currentUsers){
			//user =  this._currentUsers[userid];
			delete  this._currentUsers[userid];
		}
	},


  /**
   * 设置状态
   * 0  -- handshake
   * 1  -- connected
   * 2  -- disconnected
   *
*/
	setState: function(userid, state) {
		if (userid in this._currentUsers) {
			this._currentUsers[userid].s = state;
		}
	},

   /**
	*
	*
*/
	getState: function(userid) {
		if (userid in this._currentUsers) {
			return this._currentUsers[userid].s;
		}
	},
	setSocket: function(userid, s) {
		if (userid in this._currentUsers) {
			this._currentUsers[userid].socket = s;
		}
	},

	getSocket: function(userid) {
		if (userid in this._currentUsers) {
			return this._currentUsers[userid].socket;
		}
	},

	getAll: function() {
		return this._currentUsers
	},
	getPage: function(from,to) {
		var c=0 ,i,ret = {}
		from = +from || 0;
		to  = +to || +from + 20;
		for (i in this._currentUsers){
			c += 1;
			if(c > to)
				break;
			if(c > from )
				ret[i] =  this._currentUsers[i]

		}
		return ret;
	},

	getUser: function(userid) {
		if (userid in this._currentUsers) {
			return this._currentUsers[userid];
		}
	},

	addGroup:function(userid,groupid){
		this._currentUsers[groupid] = this._currentUsers[groupid] || {};
		if (userid in this._currentUsers) {
			this._currentUsers[groupid][userid] = 1;
		}
	}


	/**
	 * 处理消息
	 */
	,processMessage:function(msg,socket){
		msg.t = msg.t || 0;
		msg._t = new Date().getTime();
		socket = socket || uor.siosock;
		if(!socket){
			log.warn('uor not have socket discard msg:' ,msg);
			return
		}
		if(!msg._backend){
			msg._sec = sec;
			if(uor.APP.GUOLV(msg.c)){
				msg._filt = 1;
				smongo && smongo.collection.save(msg);
				log.warn('uor  filt  msg:' ,msg);
				return;
			}
			
			smongo && smongo.collection.save(msg);
		}
		//socket.emit('message',msg)
		switch (msg.t) {
			case 1:
			case 3:
			case 4:
				socket.broadcast.emit('message',msg);
			    uor.addRecentMsg(msg);
			    break;
			case 2: //todo 公会聊天
				break;
			default: //玩家一对一或1对多聊天
				var toids = msg.to,touser
			if('all' === toids){
				msg.t = 1;
			    uor.addRecentMsg(msg);
				socket.broadcast.emit('message',msg)
				log.debug('to all:',msg)
			}else if( typeof '1' === typeof toids || typeof 1 === typeof toids  ){
				touser = uor.getUser(toids);
				//touser && touser.tome(msg) || uor.offlineMsg(toids,omsg) 
			}else if(typeof toids === typeof []){
				var unum = toids.length
				for(var i = 0 ;i < unum ; i ++){
					touser = uor.getUser(toids[i]);
					touser && touser.tome(msg) || uor.offlineMsg(toids[i],msg);
				}
			}else{
				log.warn('no `to` ignore',msg._fid);
			}
		}
	}

	,getSmongo:function(){
		if(s.get('msgMongo',null) == null ){
			return null;
		}
		return require( s.WORKROOT  + '/src/model/chatmsg.js').get(comm.getMongoose(s.get('msgMongo')),'chat_msgs');
	}
	/**
	 * 
	 *  启动清理，连接redis
	 *
     */
	,start:function(app){
		var clearTimeOutUser = s.bootconfig['clearTimeOutUser'] && s.bootconfig['clearTimeOutUser'].v  || 60 ;//清除用户周期
		rc = comm.getRedis(s.get('chatRedis'))

		
		//初始化server，sec
		server = s.get('host')
		sec = s.get('sec');
		llnum = s.get('llnum',10);
		app.set('model_Uor',uor)
		uor.APP = app;
		setInterval(this.clearTimeOutUser,clearTimeOutUser * 60 * 1000);//清除timeout用户信息
		log.debug('clearTimeOutUser gap :', clearTimeOutUser ,'(sec) env',process.env['NODE_ENV'])


		smongo = uor.getSmongo();//require( s.WORKROOT  + '/src/model/chatmsg.js').get(comm.getMongoose(s.get('msgMongo')),'chat_msgs');


		//订阅游戏服务器的 sec + ':realtime' 的消息
		var wrc  = comm.getRedis(s.get('chatRedis'),{exclusive:1});
		var chname = sec + ':realtime';
		wrc.on('ready',function(){
			log.info('watch chname:',chname);
			wrc.subscribe(chname);
		}) 
		//收到消息
		wrc.on("message", function (channel, msg) {
			log.debug('watch channel: ',channel,msg);
			try{
				jso = json.parse(msg);
				if(jso){
					jso._backend = 1;
					uor.processMessage(jso);
				}
			}catch(e){
				log.warn('discard msg : ',msg);
			}
		});
	}
};

module.exports = uor;

