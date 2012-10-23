var r = module.exports = {
	 role: 'chat_server' // override by loader save from filename 
	,confserver: 'mongodb://122.11.61.28:35050/nodeconfig'
	,userMongo: 'mongodb://122.11.61.28:35050/chatserver'
	,sessionRedis: 'redis://10.200.77.180:53000'
	,chatRedis: 'redis://10.200.77.180:53005'
	,msgMongo:'mongodb://10.200.77.181:35070/chatmsg'
	,sec:'s7'
	
	,clearTimeOutUser:{
		desc: '清除长时间没有连接的用户,周期'
	    ,v:120
	}
	,heartbeats:400
	,listenPort: 8007
	,host: 's7.dzm.gamecomb.com'
	,isDev: false
	,log2console: true
	,loglevel:'info'
	,mefile: __filename // override by loader save use filename
}
