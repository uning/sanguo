
	//
app = {};
app.GUOLV =  function(c){
	var regs = [
		/[0-9]{6,}/,
		/(http[s]?:\/\/)|(taobao)|(qq)|淘宝|帐号|扣扣/i,
	];
	var ret = false,i = 0;
	for(; i < regs.length; i++){
		if(regs[i].test(c))
			return true;
	}
	return false;
}


var  contents = {
	'qq g':true,
	'http noe':false,
	'123':false,
	'taobao':true,
	'Taobao':true,
	'TaoBao':true,
	'TaoBa':false,
	'http:/':false,
	'https:// asds':true,
	'addhttp:// asds':true,
	'淘宝':true,
	'123456':true
},r,i,tr
for(c in contents){
	r = contents[c];
	tr = app.GUOLV(c);
	if(tr != r)
		console.log('KO',c+' : ',r,tr);

	
}
		console.log('KO',app.GUOLV({add:1}));
