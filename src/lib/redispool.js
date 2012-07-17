/**
 * from https://github.com/felixge/node-redis-pool/blob/master/index.js
 *
 */
var Redis        = require('redis');
var url          = require('url');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

module.exports = RedisPool;
//util.inherits(RedisPool, EventEmitter);
function RedisPool(opts) {
	if(RedisPool.singleton)
		return RedisPool.singleton
  EventEmitter.call(this);

  this.length       = 0;

  this._pool        = {};
  this._exclusive   = [];
  this._defaultHost = opts.defaultHost || 'localhost';
  this._defaultPort = opts.defaultPort || 6379;
  this.log = opts.log  || {info:function(){},debug:function(){},error:function(){}}
  RedisPool.singleton = this;

}

RedisPool.prototype.parse = function(dsn) {
  var parsed = url.parse(dsn);
  if (parsed.protocol !== 'redis:') {
    throw new Error('RedisPool.UnknownProtocol: ' + parsed.protocol);
  }

  return {
    host       : parsed.hostname || this._defaultHost,
    port       : parsed.port || this._defaultPort,
    namespace  : (parsed.pathname)
      ? parsed.pathname.substr(1)
      : ''
  };
};

RedisPool.prototype.stringify = function(parsed) {
  return url.format({
    protocol : 'redis:',
    slashes  : true,
    hostname : parsed.host,
    port     : parsed.port,
    pathname : '/' + (parsed.namespace || '')
  });
};

RedisPool.prototype.alloc = function(dsn, options) {
	if(!dsn) return null;
  var parsed = this.parse(dsn);
  this.log.info('Alloc: ' + dsn + ' (' + JSON.stringify(options) + ')');

  options = options || {};

  return (options.exclusive)
    ? this._allocExclusive(parsed)
    : this._allocInPool(parsed, options);
};

RedisPool.prototype._createClient = function(rcc) {
  var rc = Redis.createClient(rcc.port, rcc.host);
	rc = Redis.createClient(rcc.port  ,rcc.host)
	
	var self = this;
	rc.on("error", function (err) {
		self.log.error("Redis Error:" ,rcc, err);

	});
	rc.on('end',function(err){
		self.log.debug("Redis end:",rcc , err);
	})
	rc.on('ready',function(err){
		self.log.debug("Redis ready:",rcc , err);
	})


	rc.freeme = function(){
		self.free(this);

	}
  return rc;
};

RedisPool.prototype._allocExclusive = function(parsedDsn) {
  var client = this._createClient(parsedDsn)
  this._exclusive.push(client);
  this.length++;

  return client;
};

RedisPool.prototype._allocInPool = function(parsedDsn, options) {
  var key = [parsedDsn.host, parsedDsn.port];
  if (options.subscriber) key.push('subscriber');

  key = key.join(':');
  var ref = this._pool[key];

  if (ref) {
    ref.count++;
    return ref.client;
  }

  this.length++;
  this._pool[key] = ref = {
    count  : 1,
    client : this._createClient(parsedDsn)
  };

  return ref.client;
};

RedisPool.prototype.free = function(client, cb) {
  if (this._freePoolClient(client)) return;
  if (this._freeExclusiveClient(client)) return;

  var err = new Error(
    'RedisPool.FreeError: Cannot free unknown client: ' +
    this.stringify(client)
  );
  throw err;
};

RedisPool.prototype._freePoolClient = function(client) {
  var matchingRef;
  for (var key in this._pool) {
    var ref = this._pool[key];
    if (ref.client === client) {
      matchingRef = ref;
      break;
    }
  }

  if (!matchingRef) return false;

  if (!--matchingRef.count) {
    delete this._pool[key];
    ref.client.quit();
    this.length--;
  }

  return true;
};

RedisPool.prototype._freeExclusiveClient = function(client) {
  var index = this._exclusive.indexOf(client);
  if (index === -1) return false;

  this._exclusive.slice(index, 1);
  client.quit();
  this.length--;

  return true;
};

RedisPool.prototype.inspect = function() {
  var exclusive = this._exclusive.map(this.stringify.bind(this));
  var pool = [];
  for (var key in this._pool) {
    var ref = this._pool[key];
    pool.push({key: key, dsn: this.stringify(ref.client), count: ref.count});
  }

  return '<' + this.constructor.name + ' ' + util.inspect({
    length    : this.length,
    pool      : pool,
    exclusive : exclusive
  }) + '>';
};
