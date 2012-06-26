
// get required modules
var  mongoose = require('mongoose'),
crypto = require('crypto');

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

//moddel dsign
  /**
   * User model
   * 
   * Used for persisting users
   */  
function validatePresenceOf(value) {
	return value && value.length;
}

var User = new Schema({
	_id: { type: Schema.Types.Mixed ,/* */ unique:true },
	email: { type: String, validate: [validatePresenceOf, 'Email address required'], index: true },
	name: String,
	lastseen: Date,
	isonline: Boolean,
	hashed_password: String,
	salt: String
},{collection:'user',strict:false});

User.virtual('lastseendate')
.get(function() {
	return date.toReadableDate(this.lastseen, 'datestamp');
});

User.virtual('id')
.get(function() {
	if(typeof this._id == 'object')
		return this._id.toHexString();
	return this._id
});

User.virtual('password')
.set(function(pw) {
	this._password = pw;
	this.salt = this.createSalt();
	this.hashed_password = this.encryptPassword(pw);
})
.get(function() { return this._password; });

User.method('authenticate', function(plain) {
	return this.encryptPassword(plain) === this.hashed_password;
});

User.method('createSalt', function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
});

User.method('encryptPassword', function(str) {
	return crypto.createHmac('sha1', this.salt).update(str).digest('hex');
});

User.pre('save', function(next) {
	if (!validatePresenceOf(this.hashed_password)) {
		//next(new Error('Invalid password'));
	} else {
		next();
	}
});

//register validators
User.path('email').validate(function(val) {
	return val.length > 0;
}, 'EMAIL_MISSING');

User.path('name').validate(function(val) {
	return val.length > 0;
}, 'NAME_MISSING');

// register mongoose models

/*
mgserver = mongoose.connect('mongdb://localhost:35050/test');
mongoose.model('User', User,'user');
User = mongoose.model('User');
*/
mgserver = mongoose.createConnection('mongdb://localhost:35050/test');
mgserver.model('User', User,'user');
User = mgserver.model('User');








mUser = new User({'aa':[1,2,3,4],'email':'test',_id:'testuserid'});

mUser.set('rr',{it:12323})
mUser.set('password','ddd')
//mUser._id = '123213012';
mUser.isNew = false;
console.log(mUser);
//*
mUser.save(function(err,u){
	console.log('mUser.save ret ',err,u)
});
//*/
cond = {_id:'test1'};

ObjectId = mongoose.Types.ObjectId;
//cond ={_id: new ObjectId('4f13df232f47688f03000001')}
User.findById(3,function(err,user){
	user.set('mmmm','aaa')
	user.save(function(err,u){
		console.log('mUser.save ret ',err,u)

	});
	console.log("user.findone: findById(3) ",err,user)
}
)

//console.log(mongoose.connection.db);
//*
User.collection.findAndModify({_id: 5}
	   ,[],{'$set': {newdd: 12321, started: new Date()},'$inc':{'aaa':3}},
	   {
		   upsert:true
		   ,'new': true
	   }
	   
	   ,function(err,u){
	   console.log('colletcion findAndModify',u,err)
});
 
//*/
/*
//mongoose.connection.db.command({findAndModify:'user',
User.collection.db.command({findAndModify:'user',
	   query: {_id: 5}
	   ,update: {'$set': {newdd: 12321, started: new Date()}}
	   //,remove:true
	   ,'new': true
},function(err,u){
	   console.log('db findAndModify',u,err)
});
//*/


if(0){
User.findById(new ObjectId("4f13df232f47688f03000001"),function(err,user){
	console.log("user.findone: by (ObjectId()) ",err,user,user.id)
}
)

User.findById("4f13df232f47688f03000001",function(err,user){
	console.log("user.findone: by '4f13df232f47688f03000001' ",err,user)
}
)
User.findOne(cond,function(err,user){
	console.log("user.findone:cond ",err,user)
}
)
}

