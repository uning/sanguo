
var System = module.exports={
	login:function(req,res,next){
		console.log('U.login');
		res.send(200,{m:'U.login',s:'OK'});
	}
}
