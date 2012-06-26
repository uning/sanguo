
var rl = require('readline')
,cs = require('../lib/configservice')
,i = rl.createInterface(process.stdin, process.stdout, null);

var nc = cs.lload(__dirname+'/../../roleconf/login_server.dev.js')
console.log('before load:',nc)

i.question("改变 dfsd 重新加载 enter ", function(answer) {
  // TODO: Log the answer in a database
   
  console.log('before load:',nc)

  var nc = cs.lload(__dirname+'/../../roleconf/login_server.dev.js')

  console.log('before load:',nc)


  console.log('You Answer:',answer)
  // These two lines together allow the program to terminate. Without
  // them, it would run forever.
  i.close();
  process.exit();
});
