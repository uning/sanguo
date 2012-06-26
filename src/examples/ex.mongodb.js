
var mongoose=require('mongoose');
var mongo=require('mongodb');

var mongoserver = new mongo.Server('localhost',35050,{})//,{auto_reconnect:true});
var db= new mongo.Db('sanguo',mongoserver);

//db.close();
//*
db.open(function(err,dbo){
	console.log('db connected.');
	db.collection('configs', function(err, coll){
		//do stuff using collection variable


		coll.findOne({},function(err,uo){
			console.log("findOne: from db ",JSON.stringify(uo));
		});
		coll.find().each(function(err,u){
			//console.log('find each ',u,err)
		})
		coll.save( {
			name: "Next promo",
			inprogress: false, priority:0,
			tasks : [ "select product", "add inventory", "do placement"]
			,t:new Date().getTime()
			,_id:'fixedid'
		},{safe:true} ,function(err,uo){
			console.log('save ',err,uo)
		});


		coll.findAndModify( {_id: 'fixedid'}
					,{'$set': {inprogress: true, started: new Date()}}
			//,remove:true
			,{'new': true}
		,function(err,u){
			console.log('coll findAndModify',u,err)
		});

	});
	db.command({findAndModify:'test_mg',
			   query: {_id: 'fixedid'}
			   ,update: {'$set': {newdd: 12321, started: new Date()}}
			   //,remove:true
			   ,'new': true
	},function(err,u){
		console.log('db findAndModify',u,err)
	});



});
//*/
db.on("close", function(error){
	console.log("Connection to the database was closed!");
	//process.exit(0)
});

setTimeout(function(){
	//db.close();
},500);

