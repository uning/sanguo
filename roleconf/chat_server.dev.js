var r = module.exports = {
	 role: 'chat_server.dev' // override by loader save from filename 
	,sessionRedis: 'redis://localhost:53000'
	,confserver: 'mongodb://127.0.0.1:35050/sanguo'
	,userserver: 'mongodb://127.0.0.1:35050/sanguo'
	,redisserver: 'redis://localhost:53000'
	
	,clearTimeOutUser:{
		desc: '清除长时间没有连接的用户,周期'
	    ,v:120 }
	,listenPort: 8881
	,host: 'chat.playcrab.com'
	,mefile: __filename // override by loader save use filename
}
