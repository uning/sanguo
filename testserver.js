
var util = require('util')
var request = require('superagent')
var fs = require('fs')
var stream = fs.createWriteStream('baidu.html');
var url = 'http://localhost:8880/debug';
var req = request.post(url)
  .send({ name: 'Manny', species: 'cat' })
  .set('X-API-Key', 'foobar')
.end(function(res){
	console.log(res.text);
})
//req.pipe(stream);
