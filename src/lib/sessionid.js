

var PHP  = require('./php')
const  ENCODE_BASE = 2101239848
var ID = module.exports = {
	encInt: function(n) {
		var first, first3, last, mask, offset, t1, t2, t3;
		t1 = ENCODE_BASE - n;
		last = t1 & 0xFF;
		offset = last % 22 + 1;
		first3 = t1 >> 8 & 0xFFFFFF;
		mask = (1 << (31 - offset)) - 1;
		t2 = ((first3 >> offset) & mask | (first3 << (24 - offset)) & 0xFFFFFFFF) << 8;
		first = t2 >> 24 & 0xFF;
		t2 = t2 | (last ^ first);
		t3 = (t2 << 28) & 0xFFFFFFFF | (t2 >> 4 & 0x0FFFFFFF);
		return t3 >>> 0;
	},
	decInt: function(n) {
		var first, first3, last, mask, offset, t1, t2, t3;
		t1 = n << 4 & 0xFFFFFFFF | (n >> 28 & 0xF);
		first = t1 >> 24 & 0xFF;
		last = t1 & 0xFF;
		last = last ^ first;
		offset = last % 22 + 1;
		first3 = t1 >> 8 & 0xFFFFFF;
		mask = (1 << (7 + offset)) - 1;
		t2 = (first3 << offset & 0xFFFFFFFF | (first3 >> (24 - offset)) & mask) << 8 & 0xFFFFFFFF | last;
		t3 = ENCODE_BASE - t2;
		return t3>>>0;
	},

	/**
	 * php 生成
	 */
	parseCid: function(cid) {
		var dstr = ID.decodeStr(cid)
	    ,ret = dstr.split('_',3)
		if( !ret[1] ||  +ret[1] < 10000){
			return null;
		}

		return ret;
	},

	/**
	 * 生成 登录token
	 *
	 */
	genCid: function(uid,info ,tm) {
		tm = tm  || Math.floor(new Date().getTime()/1000);
		var cc  = uid + "_" + tm
		if(info)
			cc += '_' + info
		return ID.encodeStr(cc);
	},

	encodeStr:function(str){
		var i,ret = new Buffer(str.length);
		for(  i = 0 ; i < str.length ; ++i){
			switch(i%6){
				case 0 :
					ret.writeInt8(str.charCodeAt(i)-1,i);break;
				case 1 :
					ret.writeInt8(str.charCodeAt(i)-5,i);break;
				case 2 :
					ret.writeInt8(str.charCodeAt(i)-7,i);break;
				case 3 :
					ret.writeInt8(str.charCodeAt(i)-2,i);break;
				case 4 :
					ret.writeInt8(str.charCodeAt(i)-4,i);break;
				case 5 :
					ret.writeInt8(str.charCodeAt(i)-9,i);break;

			}
		}
		//return ret.toString('base64').replace(/\+\//g,'-_').replace(/=+$/g,'')
		var bret =  ret.toString('base64')//.replace(/\+\//g,'-_').replace(/=+$/g,'')
		//console.log(bret);
		var trim = true,len = bret.length
		for( i = len - 1;i > -1; --i  ){
			if(bret[i] == '=' && trim){
				len -= 1;
			}else{
				trim = false;
			}
			if(bret[i] == '+')
				bret[i] = '-';
			if(bret[i] == '/')
				bret[i] = '_';
		}
		return bret.substr(0,len);
	},
	decodeStr:function(str){

		var i,len = str.length

		for( i = str.length;i > -1; --i  ){
			if(str[i] == '-')
				str[i] = '+';
			if(str[i] == '_')
				str[i] = '/';
		}
		var ret = new Buffer(str,'base64');
		len  = ret.length
		for(  i = 0 ; i < len ; ++i){
			switch(i%6){
				case 0 :
					ret.writeInt8(ret[i]+1,i);break;
				case 1 :
					ret.writeInt8(ret[i]+5,i);break;
				case 2 :
					ret.writeInt8(ret[i]+7,i);break;
				case 3 :
					ret.writeInt8(ret[i]+2,i);break;
				case 4 :
					ret.writeInt8(ret[i]+4,i);break;
				case 5 :
					ret.writeInt8(ret[i]+9,i);break;

			}
		}
		return ret.toString('ascii');
	}
	



};
