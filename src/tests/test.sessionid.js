var srcdir = '../'
,ID = require(srcdir + 'lib/sessionid')
,should = require('should')

var p = 'sdsfsds2',dec,enc
console.log(enc = ID.encodeStr(p),dec = ID.decodeStr(enc),p == dec);

var cid = 'MForMDMvMTMyMS0uXm4zMDYZciwbOQ';
var dstr = ID.decodeStr(cid)
,ret = dstr.split('_',3)

//console.log(dstr,ret,ID.parseCid(cid));




describe('sessionid', function() {
    it('encInt decInt 应该相等', function() {
        var i = 1334915270 ,ei = ID.encInt(i)
        ID.decInt(ei).should.eql(i)
        console.log(ei,i)
    });
    it('encodeStr decodeStr 应该相等', function() {
		var p = 'sdsfsds2',dec,enc
		console.log(enc = ID.encodeStr(p),dec = ID.decodeStr(enc),p == dec);
		p.should.eql(dec)
    });
    it('php encInt js encInt 结果相同 ',function(done){
        var uid = 100
        ,cid=''
        ,spawn = require('child_process').spawn
        ,genid = spawn('php',[ __dirname +'/gencid.php',uid,'encInt'])
		,jsenc = ID.encInt(uid)
    
        genid.stdout.on('data', function (data) {
            cid = data+'';
            console.log('stdout: ' ,cid,'jsenc',jsenc);
            jsenc.should.eql(parseInt(cid))
        })
        genid.stderr.on('data', function (data) {
            "php gen error".should.equal('启动失败')
        })
        genid.on('exit', function (code) {
            code.should.eql(0)
            done()
        })
    });

    it('js encodeStr js encodeStr 相等',function(done){
        var uid = '1_123232_s1'
        ,cid=''
        ,spawn = require('child_process').spawn
        ,genid = spawn('php',[ __dirname +'/gencid.php',uid,'encodeStr'])
		,jsenc = ID.encodeStr(uid)
    
        genid.stdout.on('data', function (data) {
            cid = data+'';
            console.log('stdout: ' ,cid,'jsenc',jsenc);
            jsenc.should.eql(cid)
        })
        genid.stderr.on('data', function (data) {
            "php gen error".should.equal('启动失败')
        })
        genid.on('exit', function (code) {
            code.should.eql(0)
            done()
        })
    
    });
})
