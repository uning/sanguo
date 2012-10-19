var r = module.exports = {
	 role: 'chat_server' // override by loader save from filename 
	,confserver: 'mongodb://10.200.77.180:35050/dzm'
	,sessionRedis: 'redis://10.200.77.180:53000'
	,userMongo: 'mongodb://10.200.77.180:35100/dzm'
	,chatRedis: 'redis://10.200.77.180:53005'
	,sec:'s3'
	
	,clearTimeOutUser:{
		desc: '清除长时间没有连接的用户,周期'
	    ,v:120
	}
	,heartbeats:400
	,listenPort: 8881
	,host: 's3.dzm.gamecomb.com'
	,isDev: false
	,log2console: true
	,loglevel:'info'
	,mefile: __filename // override by loader save use filename
}
