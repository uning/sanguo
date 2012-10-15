var r = module.exports = {
	 role: 'chat_server.dev' // override by loader save from filename 
	,confserver: 'mongodb://127.0.0.1:35050/jsanguo'
	,sessionRedis: 'redis://localhost:53000'
	,userMongo: 'mongodb://127.0.0.1:35050/jsanguo'
	,chatRedis: 'redis://localhost:53000'
	
	,clearTimeOutUser:{
		desc: '清除长时间没有连接的用户,周期'
	    ,v:120
	}
	,heartbeats:false
	,listenPort: 8881
	,host: 'chat.playcrab.com'
	,isDev: true
	,log2console: true
	,mefile: __filename // override by loader save use filename
}
