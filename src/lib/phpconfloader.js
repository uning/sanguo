
/**
 * 读取php配置文件
 *
 * 直接读取php配置文件
 *
 */
(function() {
	var json = require('commonjs-utils/lib/json-ext')
	var path = require('path');
	var fs   = require('fs');
	var s = require(__dirname  + '/configservice.js')
	,comm = require(s.WORKROOT + '/src/common.js')
	,log = comm.getLogger('main')

	var PHPConfLoader = function(dir) {
		this._dir = dir
		this._datas = {}
	};



	//定义外部可见
	if (typeof exports !== 'undefined') { //node
		 module.exports = PHPConfLoader;
	}else{ //browser
		window.PHPConfLoader = PHPConfLoader;
	}

	/**
	 * 同步获取配置
	 * @param name 配置名
	 * @param key  配置项名
	 */
	PHPConfLoader.prototype.getSync = function(name,key){
		var conf = this._datas[name];
		if(conf){
			if(key)
				return conf[key];
			return conf;
		}
		return null;
	}

	/**
	 * 获取配置
	 * @param name 配置名
	 * @param key  配置项名
	 * @param fn   回调
	 *
	 */
	PHPConfLoader.prototype.get = function(name,key,fn){
		fn = fn || function(){}
		var conf = this._datas[name];
		if(conf){
			if(key)
				fn(null,conf[key]);
			else
				fn(null,conf);

			return;
		}

		var lfn = function(err,data){
		  if(!err){
			  if(key)
				  fn(err,data[key]);
			  else
				  fn(err,data);
		  }else
			  fn(err)
		}
		this.load(this._dir + '/' + name + '.php',lfn);
	}

	/**
	 * 加载全部配置文件
	 */
	PHPConfLoader.prototype.loadAll = function(fn){

		var bdir = this._dir,me = this;
		var rload = function(dir){
			fs.readdirSync(dir).forEach(function(f){
				var file = dir + '/' + f;
				var sinfo = fs.statSync(dir + '/' + f);
				if(sinfo.isFile() && /.php$/.test(f)){
					me.load(file);
					log.info('loadAll ',f)
				}else if(sinfo.isDirectory() && f != '.' && f != '..'){
					rload(file);
				}
			});
		}
		rload(bdir);
	}
	/**
	 *
	 * 加载php文件配置，执行回调，返回json
	 * note：系统必须有可运行的php
	 *
	 * @param f  -- php文件名 
	 * @param fn  加载后回调
	 *
	 * 配置名 根据文件名自动获取
	 *
	 */
	PHPConfLoader.prototype.load = function(f,fn){

		fn = fn || function(){};
		if(!fs.existsSync(f)){
			fn('file not exists ');
			log.error('load f : ',f,' file not exists');
			return;
		}
		var spawn = require('child_process').spawn
		,readphp = spawn('php',[ '-r','{$r = include(\"'+f+'\"); echo json_encode($r); }'])

		var name = path.relative(this._dir,f);
		name = name.substr(0,name.length - 4);
		var datas = this._datas;

		var outjson = '';
		readphp.stdout.on('data',function(data){
			outjson += data ;
		});
		readphp.stdout.on('end',function(data){
			try{
				jso = json.parse(outjson);
				if(jso){
					datas[name] = jso;
					fn(null,jso);
					log.info('load ok: ',name,f);

				}else{
					fn("not json");
					log.error('load f : ',f,' json parse failed');

				}
			}catch(e){
				fn("not json");
				log.error('load f : ',f,' json parse failed');
			}

		})

		readphp.stderr.on('data',function(data){
			log.error("load ",f,' load error ',''+data)
			fn("load error");
		})
	};


})();

