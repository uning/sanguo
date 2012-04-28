/**
 * LoginUseModel
 *
 */

var crypto = require('crypto')
, mongoose =  require('mongoose')
, Schema = mongoose.Schema
,comm = require('../common.js')
,CommonPlugin = require('./plugin/common.js')

var schema = new Schema({
	_id:{type:Schema.Types.Mixed}
	,pid:{type:String, index:{unique:true}, display:{help:'This must be a unique name'}}
	,name:{type:String}
	,email:{type:String}
	,password:{type:String, display:{dataType:'Password'}, get:function(){ return 'password' }}
	,groups:[
		{ type:Schema.ObjectId, ref:'group', index:true}
	]
	,secs:{type:String} // 分区
	,lsec:{type:String}
	,_mat:{type:Date, display:{display:'none'}}
	,_cat:{type:Date}
}, {safe:true, strict:false, display:{
	fields:['pid','name','email'],
	list_fields:['username','first_name','last_name','twitter','email']
}});

function sha1b64(password) {
	return crypto.createHash('sha1').update(password).digest('base64');
}

log.name =  comm.getFileLogid(__filename);

schema.pre('save', function (next) {

	var _this = this;
	if (this._doc.password && this._doc.password != 'password'){
		this.password = sha1b64(_this._doc.password)
	}
	if (this.isNew)
		this._cat = Date.now();
	else
		this._mat = Date.now();
	next();
});
schema.statics.findBypPid = function (pid) {
	return  this.where({pid:username});
}

schema.virtual('create_at').get(function(){
	return this._cat 
})

/**
 * 生成用户id
 * cb(err,id,isNew)
 */
schema.statics.genid = function(pid,cb){
	cb = cb || function(){} 
	var self = this;
	cache = comm.getCache();
	cache.get(pid,function(err,r){
		if(err){
			log.error('genid()',err)
		}else if( r){
			cb(err,r,false)
		}else{
			self.findOne({pid:pid},function(err,uo){
				if(!err){
				}else if(uo){
					cache.set(pid,uo._id) ;// 保存缓存
				}else{
					//生成id
					self.fam({
						query:{_id:'idCounter'}
						,update:{
							'$inc':{v:1}
						}
					},function(err,r){
						if(err){
						}else if(r){
							cache.set(pid,r.v) ;// 保存缓存
							cb(err,r.v,true)
						}
					})

				}
			})
		}

	})


}

schema.plugin(CommonPlugin)

/**
 * 方便不同mongodb生成，同一schema可以在不同的mongoose
 * 生成model
 *
 */
exports.get = function(moncon,collname){
	return   moncon.model(comm.getModelName(__filename), schema,collname);

}
