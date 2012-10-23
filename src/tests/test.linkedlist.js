
var LL  = require('../lib/linkedlist.js')
,should = require('should')

//*
var l = new LL;
for(var i = 0 ; i < 20; i++){
	l.rpush(i);
	if(l.size() > 10){
		l.lpop();
	}
	console.log(l.toArray());

}
l = new LL;
		var items = ['first','second'];
		should.not.exist(l.at(0))
		l.rpush(items[0]);
		l.size().should.eql(1);
		l.at(0).should.eql(items[0]);

		l.rpush(items[1]);
		l.size().should.eql(2);
		l.at(1).should.eql(items[1]);

		l.toArray().should.eql(items)
		l.rpop().should.eql(items[1])
		l.size().should.eql(1);
		l.toArray().should.eql([items[0]])
        
false &&
//*/
describe('LinkedList', function() {
    it('rpush rpop', function() {
		var l = new LL;
		var items = ['first','second'];
		should.not.exist(l.at(0))
		l.rpush(items[0]);
		l.size().should.eql(1);
		l.at(0).should.eql(items[0]);

		l.rpush(items[1]);
		l.size().should.eql(2);
		l.at(1).should.eql(items[1]);

		l.toArray().should.eql(items)
		l.rpop().should.eql(items[1])
		l.size().should.eql(1);
		l.toArray().should.eql([items[0]])

    });
	it('at',function(){
		var l = new LL;
		for(var i = 0;i<10;i += 1){
			l.rpush(i);
			l.at(i).should.eql(i);
			l.at(-1).should.eql(i);
			if(i > 1)
			l.at(-2).should.eql(i - 1);
		}
		should.not.exist(l.at(11))
		should.not.exist(l.at(-11))

	})
	it('lpush lpop',function(){
		var l = new LL;
		var items = ['first','second'];
		should.not.exist(l.at(0))
		l.lpush(items[0]);
		l.size().should.eql(1);
		l.at(0).should.eql(items[0]);

		l.lpush(items[1]);
		l.size().should.eql(2);
		l.at(1).should.eql(items[0]);
		l.toArray().should.eql([items[1],items[0]])
		l.lpop().should.eql(items[1])
		l.toArray().should.eql([items[0]])
		l.size().should.eql(1);
	})
})


