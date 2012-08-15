

var Doc = module.exports;
(
	function(){
	Doc  = function(d){
		var _data  = d;// private

		/**
		 * @param key {String} -- .分隔的字符串key
		 * @param def {Mixed}  -- 默认值
		 * @param create {Boolean} -- 是否创建该值
		 */
		this.get = function(key,def,create){
			if(!key) return _data;
			var keys = key.split('.'),i = 0,len = keys.length,li = len - 1;
			var ret = _data,nret;
			for(i = 0 ; i < len ; i += 1){
				key = keys[i]; 
				if(create){//创建只支持obj
					if(i < li)
						ret[key] = ret[key] || {};
					else
						ret[key] = ret[key] !== undefined ? ret[key] : def;
				}
				nret = ret[key]
				if(nret !== undefined){
					ret = nret;
					//console.log(i,key,ret);
					continue;
				}
				if(def !== undefined){
					if(create){
						ret[key] = def;
					}
					return def;
				}
				//throw new Error('Doc.get can not get ' + keys);
				console.log('Doc.get can not get ' + keys);
			}
			return ret;
		}

		//跟mongo db 保持一致
		this.opOne = function(key,val,op){
			op = op || '$set'
			this._update[key] = {} 
		}
	}

	Doc.prototype._update = {};//修改
})();


var arr = []
if(arr[1] === undefined){
	console.log('arr[1] have',arr);
}else{
	console.log('arr[1] not  have',arr);
}

var d1 = new Doc({_id:1})
var d2 = new Doc({_id:2,arr:[1,2,3],obj:{a:5}})
//console.log(d2.get('a.b.c',0),d1.get())
console.log('a.b.c 5, true',d2.get('a.b.c',5, true),d2.get());
console.log('arr.2',d2.get('arr.2',1005),d2.get());


