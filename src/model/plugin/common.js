

/**
 *
 * 添加findAndModify，带id的save等操作
 *
 * numch 
 * opOne  -- 对应php opOne
 *
 *
 * dbcommit -- 对应php save
 *
 */
module.exports = exports = function CommonPlugin (schema, options) {
	//tool funtion for get retrive fields
    function getQueryField(opts){
		var ret = {};
		var k,vv,kk,v;
		if('fields' in opts)
			return opts.fields

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
	schema.statics.obj2model  = function (o,id,isNew,fields) {

		var self = this,hasid = false
		if(o  && '_id' in o){
			id = o['_id']
		}
		var ret = new self(null,fields) //model 构造
		// skip _id for pre-init hooks
		ret.init(o)
		if(id) ret._doc._id = id;
		ret.isNew = typeof isNew == 'undefined' ? (id ? false : true) : isNew; 
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
	 *  @param   update     更改项
	 *
	 **/
	schema.statics.fam = function (opts,cb) {
		var fields = getQueryField(opts)
		var self = this;
		var mycb = function (err,o){
			if(o){
				//让返回值具有schema定义的方法
				if(opts.rawret)
				  cb(err,o)
			  else{
				  var ret = self.obj2model(o)
				  cb(err,ret)
			  }
			}else{
				cb(err,o)
			}
		}
		var query = this.find(opts.query);
		query.setOptions( 
			{
				upsert: 'upsert'  in opts ? opts.upsert : true
				,'new': 'new' in opts ? opts.new : true
			}
		);
		//console.log('fam fields',fields);
		query.select(fields);
		query.bind(this, 'findOneAndUpdate', opts.update);

		if ('undefined' == typeof cb)
			return query;

		this._applyNamedScope(query);
		return query.findOneAndUpdate(cb);

		/*


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
			*/
	}
	//findAndRemove
	schema.statics.far = function (opts,cb) {
		this.collection.findAndModify(
			opts.query
			,opts.sort || []
			,opts.update
			,{
				'remove':true
			}
			,cb)
	}


	/**
	 * 根据id获取
	 */
	schema.statics.idget = function(id,fields,cb){
		if(typeof fields == 'function'){
			cb = fields
			fields = false
		}
		var q = this.find({});
		q.where('_id',id)
		if(fields)
			q.select(fields)
		q.slaveOk(true).findOne(cb)
	}


	/**
	 * fname 操作字段名
	 * v     值
	 * op    操作
	 *             $set  赋值
	 *             $unset 删除
	 *
	 *             数据操作
	 *             $push  fname对应值为数组时，末尾一个元素
	 *             $pushAll push多个元素
	 *             $addToSet 集合操作，
	 *             $addToSet and $each
	 *
	 *             $pop 删除末尾
	 *             $pull   _value  ，{$gt: 3}
	 *             $pullAll
	 *             $rename
	 *             $bit
	 *
	 * 缓存
	 **/
	schema.methods.opOne = function(fname,v,op){
		var uo =  this._c_update = this._c_update || {}
		var op = op || '$set'
		var a = uo[op] =  uo[op] || {};
		uo[op][fname] = v;
	}

	/**
	 * 数值原子操作
	 */
	schema.methods.numch = function(fname,num,gt0){
		if(num == 0)
			return;
		num = num || 1;
		var gt0 = (typeof gt0 == 'undefined') ?  true:gt0;
		var a,uo
		if(gt0 && num < 0){
			this._c_cond =  cond = this._c_cond || {}
			a = cond[fname]  =  cond[fname] || {}
			a['$gt'] = (a['gt0'] || 0) - num - 1;
		}
		this._c_update = uo = this._c_update || {}
		a =  uo['$inc']  = uo['$inc'] || {}
		a[fname] = (a[fname] || 0)  + num;

	}


	/**
	 * 清空更改
	 */
	schema.methods.reset = function(){
		this._c_update = null;
		this._c_cond = null;

	}

	//只读id
	schema.virtual('id')
	.get(function() {
		//console.log('virtual(id)',this._id,typeof this._id )
		if(typeof this._id  == 'object')
			return this._id.toHexString();
		return this._id //.toString();
	});



	/**
	 * 提交更改
	 * retv -- default true
	 * rfields -- 默认，更改过的项
	 *
	 * cb 回调函数
	 */
	schema.methods.dbcommit = function(retv,rfields,cb){
		var uo = this._c_update
		var cond = this._c_cond =  this._c_cond || {}
		cond['_id'] = this._doc._id
		if(!uo){
			cb(null,this);
			return
		}

		/*
		var ret = this.ret  = this.ret || {};
		ret['ups'] = uo;
		ret['c'] = cond;
        */

		

		var retv = (typeof retv == 'undefined') ?  true: retv
		if(typeof retv == 'function'){
			cb = retv;
			rfields = false
			retv = true
		}else if(typeof rfields == 'function'){
			cb = rfields
			rfields = false
		}
		

		var m = this.model(this.schema._NAME) //不知道如何获取Model实例
		//console.log(m,cb)
		if(retv){
			var opts = {
				query:cond
				,update:uo
			}
			if(rfields)
				opts['fields'] = rfields
			m.fam(opts,cb)
		}else{
			m.update(cond,uo,{upsert:true,'new':true},cb)
		}
		
	}


}

