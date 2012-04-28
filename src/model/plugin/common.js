

/**
 *
 * 添加findAndModify，带id的save等操作
 *
 */
module.exports = exports = function CommonPlugin (schema, options) {
	//tool funtion for get retrive fields
    function getQueryField(opts){
		var ret = {};
			for( k in opts.update ){
				v = opts.update[k]
				for( kk in  v){
					ret[kk] = 1;
				}
			}
			for( k in opts.query ){
				if(k != '_id' && k.substr(0,1) != '$' )
					ret[k] = 1;
			}
			return ret;
	}
	//让返回值具有schema定义的方法
	schema.statics.obj2model  = function (o,fields) {
		var self = this;
		var ret = new self(undefined,fields) //model 构造
		// skip _id for pre-init hooks
		delete ret._doc._id;
		ret.init(o)
		return ret
	}
	/**
	 *  wapper for command findAndModify
	 *
	 *  opts
     *  @param	 query  	a filter for the query 	default array()
     *  @param	 sort 	    if multiple docs match, choose the first one in the specified sort order as the object to manipulate 	{}
     *  @param	 new 	    set to true if you want to return the modified object rather than the original. Ignored for remove. 	false
     *  @param	 fields 	see Retrieving a Subset of Fields (1.5.0+) 	All fields
     *  @param	 upsert 	create object if it doesn't exist. examples (1.5.4+) 	false 
	 *
	 **/

	schema.statics.fam = function (opts,cb) {
		var fields = 'fields' in opts ? opts.fields : getQueryField(opts)
		var self = this;
		var mycb = function (err,o){
			if(o){
				//让返回值具有schema定义的方法
				var ret = self.obj2model(o)
				cb(err,ret)
			}else{
				cb(err,o)
			}
		}

		this.collection.findAndModify(
			opts.query
			,opts.sort || []
			,opts.update
			,{
				upsert: 'upsert'  in opts ? opts.upsert : true
				,'new': 'new' in opts ? opts.new : true
				,fields:  fields
			}
			,mycb)
	}
	//findAndRemove
	schema.statics.far = function (opts,cb) {
		this.collection.findAndModify(
			opts.query
			,opts.sort || []
			,opts.update
			,{
				fields:fields in opts ? opts.fields : fields
				,'remove':true
			}
			,cb)
	}

	schema.statics.mcget = function(id,fields,cb){
		if(typeof fields == 'function'){
			cb = fields
			fields = false
		}
		var q = this.model().find({});
		q.where('_id',this._id)
		if(fields)
			q.select(fields)
		q.slaveOk(true).findOne(cb)
	}
	/*
	schema.methods.mcget = function(fields,cb){
		var q = this.model().find({});
		q.where('_id',this._id)
		if(fields)
			q.select(fields)
		q.slaveOk(true).findOne(cb)
	}
	//*/

}

