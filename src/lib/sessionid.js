
var ID = module.exports = {
	ENCODE_BASE: 2101239848,
	encInt: function(n) {
		var first, first3, last, mask, offset, t1, t2, t3;
		t1 = ID.ENCODE_BASE - n;
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
		t3 = ID.ENCODE_BASE - t2;
		return t3>>>0;
	},
	parseCid: function(cid) {
		var aa, ruid, uid;
		aa = cid.split("_");
		ruid = aa[0];
		uid = ID.decInt(ruid);
		if (uid < 1 || uid > 100000000) return null;
		return uid;
	},
	genCid: function(uid) {
		return ID.encInt(uid) + "_" + ID.encInt(Math.floor(new Date().getTime()));
	},
	encodeStr:function(str){
		var ret = []
		for( var i = 0 ; i < str.length ; ++i){
			ret.push();
		}
	}


	/** 
	 * 数据加密
	public static function encodeStr($str) 
	{ 
		$str = (string)$str; 
		$temp = ''; 
		for($i=0;$i<strlen($str);$i++) 
		{ 
			switch($i%6) 
			{ 
			case 0: 
				$temp.=chr(ord($str{$i})-1); 
				break; 
			case 1: 
				$temp.=chr(ord($str{$i})-5); 
				break; 
			case 2: 
				$temp.=chr(ord($str{$i})-7); 
				break; 
			case 3: 
				$temp.=chr(ord($str{$i})-2); 
				break; 
			case 4: 
				$temp.=chr(ord($str{$i})-4); 
				break; 
			case 5: 
				$temp.=chr(ord($str{$i})-9); 
				break; 
			} 
		} 
		$temp = self::base64url_encode($temp); 
		return $temp; 
	} 
	/* 
	 * 替换解密算法
	public static function decodeStr($str) 
	{ 
		$str = self::base64url_decode($str); 
		$temp = ''; 
		for($i=0;$i<strlen($str);$i++) 
		{ 
			switch($i%6) 
			{ 
			case 0: 
				$temp.=chr(ord($str{$i})+1); 
				break; 
			case 1: 
				$temp.=chr(ord($str{$i})+5); 
				break; 
			case 2: 
				$temp.=chr(ord($str{$i})+7); 
				break; 
			case 3: 
				$temp.=chr(ord($str{$i})+2); 
				break; 
			case 4: 
				$temp.=chr(ord($str{$i})+4); 
				break; 
			case 5: 
				$temp.=chr(ord($str{$i})+9); 
				break; 
			} 
		} 
		return $temp; 
	} 
	 */ 

};
