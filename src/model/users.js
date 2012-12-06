  /**
 */
require('./common')
var schema = new Schema({
}, {safe:true, strict:false, display:{
}});



schema.plugin(CommonPlugin)
schema._NAME = comm.getModelName(__filename);//将model名固定


/**
 *
 * 方便不同mongodb生成，同一schema可以在不同的mongoose
 * 生成model
 *
 * api public 
 *
 * @param moncon {Mongoose.Connecttion}  数据库连接
 * @param collname {String}              数据库中 collection的名字
 */
exports.get = function(moncon,collname){
	collname = collname || schema._NAME;
	return   moncon.model(schema._NAME, schema,collname);
}
