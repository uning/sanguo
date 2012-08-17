
var fs = require('fs')
,path = require('path')

/**
 *
 * api controllers
 *
 * @param {String} fdir  path of api controllers
 * @param {Bool}   nowatch  是否自动加载
 * @param {log}    log func for put error msg
 *
 */
var Api = module.exports = function(fdir,log,nowatch){
	this._handlers = {};
	this._watchers = nowatch ? null : {};
	this._fdir = fdir;
	this._log = log || require('../common.js').getLogger();
}
/**
 *  获取方法代码
 *  根据方法名自动加载js，重新加载js
 *
 *  @param 
 */
Api.prototype.get = function(method){

	var _handlers = this._handlers;
	var parts = method.split('.');

	var c = parts[0],m = parts[1],cc 

	if( c in _handlers){
		cc =  _handlers[m];
		if(!m ){
			return cc;
		}
		if( cc &&( m in cc))
			return cc[m];
	}
	//找不到，加载文件

	var log = this._log;
	var f = path.normalize(this._fdir + '/' + c +'.js');

	//闭包，封装参数
	var load = (function(f,c){
		return function(){
			if(!fs.existsSync(f)){
				log.error('load handler for '+ c +' from file '+ f +': file not exists')
				return null;
			}
			delete require.cache[f]
			var ncc = require(f)
			if(ncc){
				_handlers[c] = ncc;
			}else{
				log.error('load handler for '+ c +' from file '+ f +': require return null')
			}
			return ncc;
		}
	})(f,c);

	cc = load();
	if(cc){
		//添加watch file
		var _watchers = this._watchers;
		if(_watchers)
			if(!(f in _watchers )){
				_watchers[f] = load;
				fs.watch(f,function(ev,file){
					log.info('watch for load: ',f, ev)
					_watchers[f]();
				})
			}
	}else
		return cc;

	if(!m){
		return cc;
	}
	if(m in cc)
		return cc[m];
	log.error('load handler for '+method+' from file '+ f +': not find ',m)
	return null
}

