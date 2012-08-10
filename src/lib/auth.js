
exports.Auth = Auth = {
  /**
   * 根据cid验证用户，是否登录
   *
   * 解析完成后，在
   * req._auth.uid  //用户登录id
   * req._auth.sec  //用户登录分区 
   * req._auth.lt   //登录时间
   * 
   * 
   * @param express request
   * @param express response
   * @param express next function
  */
	cidAuth: function(req, res, next) {
		var cid = req.param('name');
		if(cid == null){
		    cid = req.cookies.cid;
		}
		if( cid == null ){
			next('not get cid',req,res);
		}

		

		var rr	= ID.parseCid(req.cookies.cid);
		if(!rr){
			next('cid parse error',req,res);
		}
		req._auth = req._auth || {};
        req._auth.uid = rr[0] //用户登录id
        req._auth.lt  = rr[1]   //登录时间
        req._auth.sec = rr[2] //用户登录分区 
		next(null,req,res)

	}

};
