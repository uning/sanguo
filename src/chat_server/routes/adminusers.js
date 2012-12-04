

module.exports = function(app,loc){

	app.ADMINS={
		isValid:function(email){
			if(this[email]){
				return true
			}else{
				return false;
			}
		},
		getName:function(email){
			if(this[email]){
				return true
			}else{
				return false;
			}
		},
		"yangzipeng@playcrab.com":{name:"杨子鹏",pass:'zp@playcrab'},
		"charlie@playcrab.com":{name:"吴磊",pass:'1234'},
		"chengchen@playcrab.com":{name:"程晨",pass:'123456'},
		"chenhk@playcrab.com":{name:"谌红坤",pass:'123456'},
		"clara@playcrab.com":{name:"高虹",pass:'123456'},
		"didiv@playcrab.com":{name:"杜杨",pass:'123456'},
		"hi@playcrab.com":{name:"Hi",pass:'123456'},
		"hr@playcrab.com":{name:"HR",pass:'123456'},
		"james@playcrab.com":{name:"施展",pass:'123456'},
		"jettie@playcrab.com":{name:"于杰",pass:'123456'},
		"kevin@playcrab.com":{name:"叶凯",pass:'123456'},
		"kf.wuxia@playcrab.com":{name:"武侠客服",pass:'123456'},
		"linying@playcrab.com":{name:"林影",pass:'123456'},
		"liuyang@playcrab.com":{name:"刘洋",pass:'123456'},
		"liwh@playcrab.com":{name:"李旺洪",pass:'123456'},
		"maoxian@playcrab.com":{name:"冒险客服",pass:'123456'},
		"monitor@playcrab.com":{name:"monitor",pass:'123456'},
		"owen@playcrab.com":{name:"欧阳刘彬",pass:'123456'},
		"qianzixun110@playcrab.com":{name:"樊丽娜",pass:'123456'},
		"quning@playcrab.com":{name:"曲宁",pass:'123456'},
		"redmine@playcrab.com":{name:"redmine",pass:'123456'},
		"srgzyq@playcrab.com":{name:"石锐",pass:'123456'},
		"tingkun@playcrab.com":{name:"曾廷坤",pass:'123456'},
		"wancheng@playcrab.com":{name:"胡磊万城",pass:'123456'},
		"wangkun@playcrab.com":{name:"王定坤",pass:'123456'},
		"weiy@playcrab.com":{name:"杨薇",pass:'123456'},
		"wely@playcrab.com":{name:"尹力炜",pass:'123456'},
		"yewei@playcrab.com":{name:"叶伟",pass:'123456'},
		"livemall@playcrab.com":{name:"购物天堂",pass:'123456'},
		"livemall_report@playcrab.com":{name:"购物天堂 数据",pass:'123456'},
		"kf@playcrab.com":{name:"客服",pass:'123456'},
		"art@playcrab.com":{name:"美术",pass:'123456'},
		"prisonville@playcrab.com":{name:"prisonville",pass:'123456'},
		"all@playcrab.com":{name:"所有人",pass:'123456'},
		"zeus@playcrab.com":{name:"我的冒险",pass:'123456'},
		"adventure_report@playcrab.com":{name:"我的冒险 数据",pass:'123456'},
		"wuxia@playcrab.com":{name:"武侠项目",pass:'123456'},
		"op@playcrab.com":{name:"运营组",pass:'123456'}
	,pass:'123456'}
}
