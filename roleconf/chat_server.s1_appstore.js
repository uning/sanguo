var r = module.exports = {
	 role: 'chat_server' // override by loader save from filename 
	,confserver: 'mongodb://122.11.61.28:35050/nodeconfig'
	,userMongo: 'mongodb://122.11.61.28:35050/chatserver'
	,sessionRedis: 'redis://10.200.13.38:53000'
	,chatRedis: 'redis://10.200.13.38:53005'
	,msgMongo:'mongodb://10.200.13.129:35070/chatmsg'
	,sec:'s1'
	
	,clearTimeOutUser:{
		desc: '清除长时间没有连接的用户,周期'
	    ,v:120
	}
	,heartbeats:400
	,listenPort: 8001
	,host: 's1.dzm.playcrab.com'
	,isDev: false
	,log2console: true
	,loglevel:'info'
	,mefile: __filename // override by loader save use filename
}
