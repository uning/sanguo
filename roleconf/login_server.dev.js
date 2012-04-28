var r = module.exports = {
	mefile: __filename // override by loader save use filename

	,role: 'login_server.dev' // override by loader save from filename 

	,loginmongodb:'mongodb://127.0.0.1:35050/sanguo'
	,sessionRedis:'redis://localhost:53000'
	,confserver: 'mongodb://127.0.0.1:35050/sanguo'
	,cacheserver: 'redis://localhost:53000'
	,sections: {
		sec1: {
			name: '富甲天下'
			,gameservers: {
				sec1_g1: {
					host: '192.168.1.50'
					,port: 4040}
				,sec1_g2: {
					host: '192.168.1.50'
					,port: 4042}}}}
	,simarr: [
		1
		,2
		,3
		,{
			a: 333}
		,{
			a: [
				1
				,2
				,3]}]
	,_id: 'login_server.dev:login_server.dev'}
