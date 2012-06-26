
var comm = require('./common.js')
console.log('common parent aa',comm.parent)
var log = comm.getLogger('test');
log.debug('debug')
