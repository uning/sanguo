/*
 配置
 所有配置文件以代码方式维护
 包含一个 
  mefile
  confserver monodb

 配置redis 
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


var WORKROOT = path.resolve(__dirname + '/../../');
log.name = path.basename(__filename)

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

	,btlload:function(file,cb){
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
		this.lload(file,function(err,o){
			if(err){
				log.error('btlload() exit err: ',err)
				process.exit(1)
			}
			o.role =  path.basename(o.mefile,'.js') //自动获取role,启动配置，用最后一级文件名
			self.bootconfig = o;

			cb(err,o)
		})
	}
	,btnload:function(role,cb){
		var self = this
		var fn = function(err,o){
			if( err || !o ){
				log.error('btnload() bootconfig with err ',err,o)
				process.exit(1)
			}else{
				self.bootconfig = o
				self.lsave()
				cb && cb(err,o)
			}
		}
		this.nload(role,fn);

	}

  /**
   * 加载配置文件,默认加载启动配置
   * argv[2] > process.env.BOOTFILE
   * @param {Object} confo 
   * @return 
   * @api public
   */
	,lload: function(file,callback){
		var self = this;
		callback = callback || function(){}
		try{
			var afile = fs.realpathSync(file)
			delete require.cache[afile]
			var confo = require(afile)
			confo.mefile = afile; //保存文件信息
			confo.role = path.relative(WORKROOT,confo.mefile) //自动获取role
			callback(null,confo)
		}catch (e){
			log.error(' lload() '+ file +' failed :' +  e.message + '  at line ' +   e.lineNumber,e ); 
			callback('lload '+ file +' failed')
		}
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
		if(!us.isObject(confo) && typeof confo.mefile != typeof ''){
			callback('invalid obj')
			log.error(" lsave() error invalid obj",confo);
		} 
		var str = prettyjson(confo)
		fs.writeFile(confo.mefile,util.format('var r = module.exports = %s',str),function(err){
			if(err){
				log.error('lsave() error ',err,confo.mefile)
			}else{
				log.info(" lsave() ok")
			}
			callback(err)
		})
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
				log.info('nsave() ' + key + '  ok')
			}
			callback(err);
		})
	}
	,inspect:function(){
		return prettyjson(this.bootconfig)
	}

}  

/*
process.env.BOOTFILE = __dirname + '/../../roleconf/login_server.dev.js'
s.btlload()
console.log('dd',s)

//*/
