

var MLL  = require('../lib/maplinkedlist.js')
,should = require('should')

//*
var l = new MLL;
for(var i = 1 ; i < 20; i++){
	l.rpush(i,i + ' value');
	if(l.size() > 10){
		l.lpop();
	}
	console.log(l.toArray(),l.size());
}

var l = new MLL;
for(var i = 1 ; i < 20; i++){
	l.lpush(i,i + ' value');
	if(l.size() > 10){
		l.rpop();
	}
	console.log(l.toArray(),l._maps,l.size());
}

var l = new MLL;
for(var i = 1 ; i < 20; i++){
	l.lpush(i,i + ' value');
}
console.log(l.toArray(),l._maps,l.size());
console.log(l.get(18),l.removeListAndMap(8),l.size(),l.toArray());
console.log(l.getr(18),l.size(),l.toArray());
console.log(l.getr(17),l.size(),l.toArray());
        
false &&
//*/
describe('LinkedList', function() {
})


