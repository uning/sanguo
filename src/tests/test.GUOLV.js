
	//
app = {};
app.GUOLV =  function(c){

	app.filter_reg = /[0-9]{6,}|(http[s]?:\/\/)|q号|扣:|yb|元宝|(taobao)|(qq)|淘宝|帐号|扣扣/i
	if(app.filter_reg.test(c))
	return true;

	return false;
	var regs = [
		/[0-9]{6,}/,
		/(http[s]?:\/\/)|yb|元宝|q:|(taobao)|(qq)|淘宝|帐号|扣扣/i,
	];
	var ret = false,i = 0;
	for(; i < regs.length; i++){
		if(regs[i].test(c))
			return true;
	}
	return false;
}


var  contents = {
	'号码':false,
	'qq g':true,
	'http noe':false,
	'123':false,
	'taobao':true,
	'Taobao':true,
	'TaoBao':true,
	'TaoBa':false,
	'http:/add':false,
	'https://a asds':true,
	'addhttp:// asds':true,
	'淘宝充值':true,
	'元宝':true,
	'123456':true,
	'123':false
},r,i,tr
for(c in contents){
	r = contents[c];
	tr = app.GUOLV(c);
	if(tr != r)
		console.log('KO',c+' : ',r,tr);

	
}
		console.log('KO',app.GUOLV({add:1}));
