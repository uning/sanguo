
//全局变量，包含该文件后全局可见
var fs = require('fs')
,path = require('path')
,mongoose = require('mongoose')
,util = require('util')
,RedisPool = require("./lib/redispool.js")
,Logger = require("./lib/logger")
,s = require("./lib/configservice.js")
,WORKROOT =  path.resolve(__dirname + '/../');
//,Logger = require("./lib/winston_logger")


var getLogger = exports.getLogger = function(name,opts){
	return Logger.get(name,opts)
}

var getRedis = exports.getRedis = function(uri,opts){
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

//初始化log
log = exports.getLogger()
,redispool = new RedisPool({log:log})

