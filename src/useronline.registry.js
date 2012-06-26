/**
 * 
*/

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
	//获取名字及好友列表
	User.findById(id,function(err,user){
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

}
ChatUser.prototype.getRecentMsgs = function(callback){
	var mid = 'msg:'+ this.id
	var old = new Date().getTime() - 86400*1000*1;
	rc.lrange(mid,0,-1,function(err,res){
		log.debug(mid ,' recent msg from redis:',res,err);
		if(err){
			log.error('get recent messages failed ',err)
			callback(err,data);
		}else{
			var rmsgs = [],mo
			for(var i = 0; i < res.length || i > 20; i++ ){
				mo = json.parse(res[i]);
				if(mo._t  > old)
				rmsgs.push(mo);
			}
			callback(null,rmsgs);
		}
	})
}
/**
 * 向redis 服务器注册
 */
ChatUser.prototype.login = function(){
	var mid = 'msg:'+ this.id
	,multi = rc.multi()
	,a
	,rmsgs = this._rmsgs
	,i

	multi
	.sadd(app.set('host') + ':onlineusers',this.id)
	.hset('user2server',this.id,app.set('host'))
	.set('info:'+this.id,json.stringify({lastseen:this.lastseen,server: app.set('host'),systime:this.systime}))
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
		rmsgs.push(msg);
		if(rmsgs.length > 10){
			rmsgs.pop();
		}
		return; //wether to save history
	}
	var mid = 'msg:'+ this.id,multi = rc.multi()
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


exports.UserOnlineRegistry = {
	_currentUsers: {},
	_currentGroups: {}, //群
	_banUsers:{},

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
		var to = t || 1800000,now = new Date().getTime(),u
		for(id in this._currentUsers){
			u = this._currentUsers[id]
			if(u.lastseen.getTime() + to < now && u.socket == null ){
				delete  this._currentUsers[userid];
				log.debug('clearTimeOutUser:',u)
			}
		
		}
		log.info('do clearTimeOutUser end');
		
	},

	/**
	 * 离线消息存储
	 */
	 offlineMsg:function(touid,msg){
		 var uo = new ChatUser();
		 uo.id = touid;
		 uo.tome(msg);
		 log.warn('offlineMsg: to ',uid,' from ',msg._fid)

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

};

