
//全局变量，包含该文件后全局可见
var fs = require('fs')
,path = require('path')
,mongoose = require('mongoose')
,util = require('util')
,RedisPool = require("./lib/redispool.js")
,s = require("./lib/configservice.js")
,WORKROOT =  path.resolve(__dirname + '/../');


var getLogger = exports.getLogger = function(name,opts){
	var Logger;
	if(s.get('logger','') == ''){
		Logger = require("./lib/logger")
	}else{
	    Logger = require("./lib/winston_logger")
	}
	opts = opts || {};
	if(s.get('log2console',true)){
		opts.console = true;
	}
        opts.level=s.get('loglevel','debug');
	return Logger.get(name,opts)
}

var getRedis = exports.getRedis = function(uri,opts){
	//初始化log
	var log = getLogger()
	,redispool = new RedisPool({log:log})
	return redispool.alloc(uri,opts)
}

exports.getMongoose = function(uri){
	return mongoose.createConnection(uri);
}

exports.getCache  = function(){
	return getRedis(s.bootconfig.cacheserver);
}
exports.getModelName = function(file){
	return  path.basename(file,'.js')
}

exports.getFileLogid = function(file){
    return path.relative(WORKROOT,file)
}



