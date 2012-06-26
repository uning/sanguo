
var r = module.exports = {
	role:'login_server'
	,mongodb:{
		host:'localhost'
		,port: 35050
	}
	,sessionRedis:{
		host:'localhost'
		,port:53000
	}
	,confserver:'mongodb://127.0.0.1:35050/sanguo'
	,dbserver:'mongodb://127.0.0.1:35050/sanguo'
	,cacheserver:'redis://localhost:53000'
	,sections:{
		s1:{
			name:'富甲天下'
			,gameservers:{
				s1_g1:{
					host:'192.168.1.50'
					,port:4040
				}
				,s1_g2:{
					host:'192.168.1.50'
					,port:4042
				}


			}
		}
	}
	,mefile: __filename
	,simarr:[
		1,2,3
		,{
			a:333
		}
		,{a:[1,2,3]}
	]
}
