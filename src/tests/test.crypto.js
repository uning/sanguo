


// php des 加密模块和node 不一样
crypto = require('crypto')

var key = 'xx';
var plain_text = 'very important';
//var iv = new Buffer(8)//"\0\0\0\0\0\0\0\0";

cyp = crypto.createCipher('des-ecb',key);

//cyp.setAutoPadding(false);
ec = cyp.update(plain_text);
ec += cyp.final();

console.log(ec.constructor.name,ec.length);
for(var i = 0; i < ec.length; i++){
	console.log(ec.charCodeAt(i));
}



process.exit(0);

var spawn = require('child_process').spawn
,genid = spawn('php',[ __dirname +'/crypro.php',key,plain_text])

genid.stdout.on('data', function (data) {
	//var cid = data+'';
	console.log('php stdout: ' ,data.constructor.name);
})
genid.stderr.on('data', function (data) {
	"php gen error".should.equal('启动失败')
})
genid.on('exit', function (code) {

})

console.log('enc:',ec.constructor.name,ec.length);
//process.exit(0);

if(0){
dcyp = crypto.createDecipher('des-ecb',key);
dec = dcyp.update(ec,'base64','utf8');
dec += dcyp.final('utf8');
console.log('dec:',"\n",dec,"\n",plain_text);

ecphp = 'Y1njv08qdDt1yFxMiHBn2Q==';
dcyp = crypto.createDecipher('des-ecb',key);
dec = dcyp.update(ecphp,'base64','utf8');
//dec += dcyp.final('utf8');
console.log('dec:',"\n",dec,"\n",plain_text);


// async
crypto.randomBytes(256, function(ex, buf) {
	if (ex) throw ex;
	//console.log('Have %d bytes of random data: %s', buf.length, typeof buf);
})

}


