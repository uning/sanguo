/**
 * LoginUseModel
 *
 */

require('./common')
log.name =  comm.getFileLogid(__filename);
var schema = new Schema({
	_id:{type:Schema.Types.Mixed}
	,pid:{type:String, index:{unique:true}, display:{help:'This must be a unique name'}}
	,name:{type:String}
	,email:{type:String,index:true}
	,password:{type:String, display:{dataType:'Password'}, get:function(){ return 'password' }}
	,secs:{type:String} // 分区
	,ls:{type:String}
	,_mat:{type:Date, display:{display:'none'}}
	,_cat:{type:Date}
}, {safe:true, strict:false, display:{
	fields:['pid','name','email'],
	list_fields:['name','first_name','last_name','twitter','email']
}});


function passEnc(password) {
	var PWS='plss';
	return crypto.createHash('md5').update(PWS).update(password).digest('hex');
}

/**
 * 加密密码
 */
schema.pre('save', function (next) {

	var _this = this;
	if (this._doc.password && this._doc.password != 'password'){
		this.password = passEnc(_this._doc.password)
	}
	if (this.isNew)
		this._cat = Date.now();
	else
		this._mat = Date.now();
	next();
});
schema.statics.findByPid = function (pid,cb) {
	return  this.find({}).where({pid:pid}).findOne(cb);
}

schema.virtual('create_at').get(function(){
	return this._cat 
})

/**
 * 生成用户id
 * cb(err,id,isNew,u)
 */
schema.statics.genid = function(pid,initdata,cb){
	cb = cb || function(){} 
	cache = typeof cache != 'undefined' ? cache : true ;
	var self = this,ccb = function(){}
	cache = comm.getCache();
	initdata = initdata || {}

	
	cache.get(pid,function(err,r){
		if(err){
			log.error('genid() for ' + pid,err)
			cb(err,r,false)
		}else if(r){
			var u = self.obj2model(null,r);
			u.isNew = false;
			cb(err,r,false,u)
		}else{
			self.findOne({pid:pid},function(err,uo){
				if(err){
					cb(err,r,false)
				}else if(uo){
					cache.set(pid,uo._doc._id,ccb) ;// 保存缓存
					cb(err,uo._doc._id,false,uo)
				}else{
					//生成id
					self.fam({
						query:{_id:'igen_incid'}
						,update:{
							'$inc':{maxid:1}
						}
					},function(err,r){
						if(err){
							cb(err,r.maxid,true);
						}else if(r){
							cache.set(pid,r.maxid,ccb) ;// 保存缓存
							initdata.pid = pid
							var um =  self.obj2model(initdata,r.maxid);
							um.isNew = true;
							um.save(function(err,u){
								cb(err,r.maxid,true,u);
							})
						}
					})

				}
			})
		}

	})
}

schema.plugin(CommonPlugin)
schema._NAME = comm.getModelName(__filename);//将model名固定

/**
 *
 * 方便不同mongodb生成，同一schema可以在不同的mongoose
 * 生成model
 *
 */
exports.get = function(moncon,collname){
	return   moncon.model(schema._NAME, schema,collname);

}
