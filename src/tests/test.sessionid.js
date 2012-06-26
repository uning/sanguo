var srcdir = '../'
,ID = require(srcdir + 'lib/sessionid')
,should = require('should')

describe('sessionid', function() {
    it('encInt decInt 应该相等', function() {
        var i = 1334915270 ,ei = ID.encInt(i)
        ID.decInt(ei).should.eql(i)
        console.log(ei,i)
    });
    it('parseCid php生成id',function(done){
        var uid = 100
        ,cid=''
        ,spawn = require('child_process').spawn
        ,genid = spawn('php',[ __dirname +'/gencid.php',uid,1])
    
        genid.stdout.on('data', function (data) {
            cid = data+'';
            console.log('stdout: ' , cid);
            var uuid = ID.parseCid(cid);
            uuid.should.eql(uid)
            console.log('in php stdout: ',uuid , cid);
        })
        genid.stderr.on('data', function (data) {
            "php gen error".should.equal('启动失败')
        })
        genid.on('exit', function (code) {
            code.should.eql(0)
            done()
        })
    });
    it('php parse js生成id',function(done){
        var uid = 100
        ,cid=ID.genCid(uid)
        ,spawn = require('child_process').spawn
        ,genid = spawn('php',[ __dirname +'/gencid.php',cid])

        genid.stdout.on('data', function (data) { 
            cid = parseInt(data);
            console.log(' stdout: ' , cid);
		})
	});
})
