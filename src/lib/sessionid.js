
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
	}
};
