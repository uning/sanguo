/*
 配置
 所有配置文件以代码方式维护
 包含一个 
  mefile
  confserver monodb

  l -- local
  n -- network
  lsave file -- 储存到本地文件
  nsave host port --- 到配置服务器
  lload file   -- 重新加载
  nload host port key
*/

var fs = require('fs')
,us = require('underscore')
,util = require('util')
,path = require('path')
,mongoose=require('mongoose')
,log = require('./logger.js').get()

const WORKROOT = path.resolve(__dirname + '/../../');
//log.name = path.basename(__filename)

var prettyjson = function(o,space,spacer){
	space = space || ''
	spacer = spacer || "\t";
	var oi,r = '',i,tab = space + spacer,adc = false

	if(us.isArray(o)){
		r = "[\n"
		if(o.length >0)
			r += tab +' ' + prettyjson(o[0],tab,spacer) 
		for ( i = 1; i < o.length ; i++) {
			r +=  "\n"+tab +','+ prettyjson(o[i],tab,spacer) 
		}
		//r += "\n"+space +"]";
		r += "]";
	}else if(us.isObject(o)){
		r = "{\n"
		adc = false
		for (i in o){
			if(adc === false){
				adc = true;
				r += tab + ' ';
			}else{
				r += '\n' + tab +',';
			}

			if(i  === 'mefile' && space ===''){
				r +=  i +': __filename // override by loader save use filename\n'  
			}else if(i  === 'role' && space ===''){
				r +=  i +': \''+ o[i] +'\' // override by loader save from filename \n'  
			}else{
				r +=  i +': ' + prettyjson(o[i],tab,spacer)
			}
		}
		//r += "\n" +space +"}";
		r +=  "}";
	}else if(us.isString(o)){
		r = "'" + o +"'"
	}else{
		r = o + '';
	}
	return r;
}





var s = module.exports = {

	bootconfig:{},


	getModel: function(){
		if(this.model){
			return this.model;
		}
		var config_schema = new mongoose.Schema({
			_id: { type: String ,/* */ unique:true }
		},{collection:'configs',strict:false});
		var CONFSERVER = this.bootconfig.confserver ||process.env.CONFSERVER ||  'mongodb://127.0.0.1:35050/sanguo';
		log.debug('getModel() ',CONFSERVER ,typeof(CONFSERVER),CONFSERVER === 'mongodb://127.0.0.1:35050/sanguo')
		this.mgserver  =  mongoose.createConnection(CONFSERVER);//只创建一次
		return this.model = this.mgserver.model('Config',config_schema,'configs')
		
	}

  /**
   *  把配置保存到文件 
   * @param {Object} confo 
   * @return 
   * @api public
   */
	,lsave:function(confo,callback){
		callback = callback || function(){}
		if(!confo){
			if(this.bootconfig.role)
				confo = this.bootconfig;
			else{
				log.error(' lsave() no confo')
				callback('no confo')
				return;
			}
		}
		if(!us.isObject(confo) && typeof confo.role != typeof ''){
			callback('invalid obj')
			log.error(" lsave() error invalid obj",confo);
		} 
		var str = prettyjson(confo)
		var sfile =  WORKROOT + '/roleconf/' + confo.role +'.js';
		fs.writeFile(sfile,util.format('var r = module.exports = %s',str),function(err){
			if(err){
				log.error('lsave() error ',err,sfile)
			}else{
				log.debug(" lsave() ok")
			}
			callback(err)
		})
	}
  /**
   * 加载配置文件,默认加载启动配置
   * @param {Object} confo 
   * @return 
   * @api public
   */
	,lload: function(file,callback){
		var self = this,nex = true
		callback = callback || function(){}
		
		try{
			var afile = fs.realpathSync(file)
			delete require.cache[afile]
			var confo = require(afile)
			confo.mefile = afile; //保存文件信息
			confo.role = path.relative(WORKROOT,confo.mefile) //自动获取role
		}catch (e){
			nex = false
			
			callback('lload '+ file +' failed :' + e.message)
		}
		if(nex)
			callback(null,confo)
	}


	/**
	 * 从数据库load配置
	 */
	,nload:function(name,callback){
		callback = callback || function(){}
		if(!name){
			if(this.bootconfig.role)
				name = this.bootconfig.role;
			else{
				log.error(' nload() no confo')
				callback('no confo')
				return;
			}
		}
		var key = (this.bootconfig.role || name )   + ':' + name; 
		var m = this.getModel()
		m.findOne({_id:key},function(err,o){
			if(err){
				log.error(' nload() db Connection failed',err)
				callback(err);
			}else{
				if(!o){
					log.error('nload()  key '+ key +' emptyconf')
					callback('emptyconf')
				}else{
					var no = JSON.parse(JSON.stringify(o));//i don't know why,the result cannot directly use 
					callback(err,no)
				}
			}
		})

	}


	,nsave:function(confo,callback){
		callback = callback || function(){}
		if(!confo){
			if(this.bootconfig.role)
				confo = this.bootconfig;
			else{
				log.error(' nsave() no confo')
				callback('no confo')
				return;
			}
		}
		var key = this.bootconfig.role + ':' + confo.role; 
		var m = this.getModel()
		confo['_id'] = key;
		m.collection.save(confo,function(err){
			if(err){
				log.error('nsave() ' + key + ' failed:',err)
			}else{
				log.debug('nsave() ' + key + '  ok')
			}
			callback(err);
		})
	}

	,inspect : function(){
		return prettyjson(this.bootconfig)
	}

	/**
	 * 启动时调用
	 */
	,btload : function(file,cb){
		cb = cb || function(){}
		var self = this;
		if(typeof file !== typeof ''){
			if(typeof file !== typeof ''){
				file = self.bootconfig.mefile;
			}
			if(typeof file !== typeof ''){
				file = process.env.BOOTFILE;
			}
		} 	
		if(!file || file === '' || typeof file != typeof ''){
			cb('no bootconfig or process.env.BOOTFILE provide')
			process.exit(0)
			return 
		}

		var loadok = function(err,o){
			o.role =  path.basename(o.mefile,'.js') //自动获取role,启动配置，用最后一级文件名
			self.bootconfig = o;
			cb(err,o)
		}
		self.lload(file,function(err,o){
			if(err){
				log.info('lload() failed err ,try load config from monodb : ',err)
				var role =  path.basename(file,'.js');
				self.nload(role,function(err,o){
					if(err){
						log.error('try load config from monodb) : ',err)
						process.exit(1)
					}else{
						loadok(err,o)
						self.lsave(o);
					}
				})
				//process.exit(1)
			}else{
				loadok(err,o)
				self.nsave(o);
			}
		})
	}


	//================
	//load 之后可以用的方法
	
	,get : function(name,def){
		if(s.bootconfig[name])
			return s.bootconfig[name];

		if(def)
			return def;
		log.error('get config ', name ,' not find')
		//直接退出，差关键配置
		process.exit(1);

	}





}  

/*
process.env.BOOTFILE = __dirname + '/../../roleconf/login_server.dev.js'
s.btlload()
console.log('dd',s)

//*/
