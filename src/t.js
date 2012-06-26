
json = require('commonjs-utils/lib/json-ext');

var s=343;console.log(s.length);

function od(code){
	return console.log(code + ': ',eval(code));
}
console.time('start');
var oStringObject = new String("hello world");

od('json')
od('oStringObject');//直接输出
od('oStringObject.toString()');//显示调用
od('oStringObject+5');//字符串连接自动装换 
od('oStringObject.slice(1)'); //子串 , 1->end
od('oStringObject.slice(1,5)');//1->5
od('oStringObject.slice(-1)');//end->end-1
od('oStringObject.slice(-3,-1)');//end-1->end-1
od('oStringObject.slice(1,-1)');//1->end-1
od('oStringObject[1]');//array index: e
od('typeof oStringObject');//

var str1 = new String("Hello"), str2 = new String("Hello");
od('str1 == "Hello"'); 
od('str2 == "Hello"');
od('str1 != str2');

od('null === undefined');
od('typeof notdefined === "undefined"');

//number property name 
var iha = {
	3:'my index is 3',
	hello:' hello'
}
od('iha');

var a='iam a string';
od('a')
od('typeof a ')
od('typeof null ')

od("json.stringify('a:a')");

try{
od("json.parse('a:a')");
}catch(e){
	console.log(e);
}

var users = {'id':3,name:5,age:6}


var fun = function(){
	uuudd = 1;//global vars
}
fun();
console.log('uudd',uuudd)


console.timeEnd('start');



