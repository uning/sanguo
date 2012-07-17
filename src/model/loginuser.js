  /**
 * LoginUseModel
 */
require('./common')
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
	,_password:{type:String}
}, {safe:true, strict:false, display:{
	fields:['pid','name','email'],
	list_fields:['name','first_name','last_name','twitter','email']
}});


//跟php一致
function passEnc(password) {
	const PWS='plss';
	return crypto.createHash('md5').update(PWS).update(password).digest('hex');
}


schema.virtual('create_at').get(function(){
	return this._cat 
})

//*
//设置密码
schema.virtual('pass').get(function() { return this.password; }).set(function(pw) {
	this._password = pw;
	this.password = passEnc(pw);
});
//*/

/**
 * 加密密码
 * not work
 */
schema.pre('save', function (next) {
	var self = this;
	if (this._password && this._password != 'password'){
		this.password = passEnc(this._password)
	}
	if (this.isNew)
		this._cat = Date.now();
	this._mat = Date.now();
	next();
});
schema.statics.findByPid = function (pid,cb) {
	return  this.find({}).where({pid:pid}).findOne(cb);
}


var cache ; //缓存cache
/**
 * 生成用户id
 * cb(err,id,isNew,u)
 */
schema.statics.genid = function(pid,initdata,cb){
	cb = cb || function(){} 
	var self = this,ccb = function(){}
	cache = cache || comm.getCache() ;
	initdata = initdata || {}

	var real_gen = function(){
		self.findOne({pid:pid},function(err,uo){
			if(err){
				cb(err,r,false)
			}else if(uo){
				cb(err,uo._doc._id,false,uo)
				cache && cache.set(pid,uo._doc._id,ccb) ;// 保存缓存
			}else{
				//生成id
				self.fam({
					rawret: true
					,query:{_id:'igen_incid'}
					,update:{
						'$inc':{maxid:1}
					     ,'$set':{pid:'igen_incid'} //for pid unique
					}
				},function(err,r){
					//console.log('initdata',err,r,initdata);
					if(err){
						cb(err,r);
					}else if(r){
						
						cache && cache.set(pid,r.maxid,ccb) ;// 保存缓存
						initdata.pid = pid
					   // console.log('initdata',r,r.maxid,initdata);
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
	if(cache){
		cache.get(pid,function(err,r){
			if(err){
				log.error('genid() for ' + pid,err)
				cb(err,r,false)
			}else if(r){
				var u = self.obj2model({},r)
				u.isNew = false ;
				cb(err,r,false,u)
			}else{
				real_gen()
			}

		})
	}else{
		real_gen()
	}
}


schema.methods.authPass = function(plain) {
	//log.debug('.authPass',passEnc(plain),plain,this,this._doc.password)
	return passEnc(plain) === this._doc.password;
};


schema.plugin(CommonPlugin)
schema._NAME = comm.getModelName(__filename);//将model名固定


/**
 *
 * 方便不同mongodb生成，同一schema可以在不同的mongoose
 * 生成model
 *
 */
exports.get = function(moncon,collname){
	collname = collname || schema._NAME;
	return   moncon.model(schema._NAME, schema,collname);

}
