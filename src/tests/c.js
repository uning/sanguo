
a = require('./a')
b = require('./b')
aa = require('../aa')

//console.log( require.cache)
delete require.cache['/backup/mywork/sanguo/src/common.js']
comm = require('../common')
console.log('common parent c',comm.parent)
