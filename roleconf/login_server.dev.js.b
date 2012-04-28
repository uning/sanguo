
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
	,sections:{
		sec1:{
			name:'富甲天下'
			,gameservers:{
				sec1_g1:{
					host:'192.168.1.50'
					,port:4040
				}
				,sec1_g2:{
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
