var Logger, colors, getReadableDate, levels, max, padlevels, util;


util = require("util");


var loggers = {};
exports.get = function(name,opts) {
	var name = name || 'default'
	if(loggers[name])
		return loggers[name];
  return loggers[name] = new Logger(name,opts);
};

var getLevel= function(name) {
	var i = 0;
	for( ; i < levels.length; i++){
		if(levels[i] == name)
			return i
	}
	return i;
};

Logger = function(name,opts) {
  opts = opts || {};
  this.colors = false !== opts.colors;
  this.lvl = getLevel(opts.level || 'debug');
  this.enabled = opts.enabled || true;
  this.name = name || opts.name ;

  //console.log('new logger level:',this,opts);
  return this.wdate =  'wdate' in  opts  ? opts.wdate : true;
};

levels = ["error", "warn", "info", "debug"];


padlevels = [];

colors = [31, 33, 36, 90];

getReadableDate = function() {
  var day, hour, inputDate, min, month, padDatePart, sec, year;
  padDatePart = function(part) {
    if (part < 10) {
      return "0" + part;
    } else {
      return part;
    }
  };
  inputDate = new Date();
  year = inputDate.getFullYear();
  month = inputDate.getMonth();
  day = inputDate.getDate();
  hour = inputDate.getHours();
  min = inputDate.getMinutes();
  sec = inputDate.getSeconds();
  return year + "" + padDatePart(month) + padDatePart(day) + "@" + padDatePart(hour) + ":" + padDatePart(min) + ":" + padDatePart(sec);
};

Logger.prototype.log = function() {
  if (this.clvl > this.lvl || !this.enabled) return this;
  var i, l, param,index = this.clvl;
  param = [];
  if (this.colors) param.push("  \u001b[" + colors[index] + "m");
  if (this.wdate) param.push("[" + getReadableDate() + "]");
  param.push(padlevels[index]);
  i = 0;
  l = arguments.length;
  while (i < l) {
    param.push(arguments[i]);
    i++;
  }

  if (this.colors) param.push(" \u001b[39m");
  //*
  if(typeof this.name  === 'string'){
	  //param.push(__logid);
	  param.push(this.name);
  }
  // param.push(this.clvl);
  // param.push(this.lvl);
  //*/
  console.log.apply(console, param);
  return this;
};

max = 0;

levels.forEach(function(name, k) {
  max = Math.max(max, name.length);
  return Logger.prototype[name] = function() {
    this.clvl = k;
    return this.log.apply(this, arguments);
  };
});

levels.forEach(function(name, k) {
  return padlevels.push(name + new Array(max - name.length + 1).join(" "));
});
