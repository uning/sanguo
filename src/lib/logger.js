var Logger, colors, getReadableDate, level2int, levels, max, padlevels, util;


util = require("util");


var loggers = {};
exports.get = function(name,opts) {
	if(loggers[name])
		return loggers[name];
  return loggers[name] = new Logger(name,opts);
};

Logger = function(name,opts) {
  opts = opts || {};
  this.colors = false !== opts.colors;
  this.level = opts.level || 3;
  this.enabled = opts.enabled || true;
  this.name = name || opts.name ;
  return this.wdate = opts.wdate || false;
};

levels = ["error", "warn", "info", "debug"];

level2int = {};

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
  var i, index, l, param;
  index = level2int[this.type];
  if (index > this.level || !this.enabled) return this;
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
  if(typeof this.name  === 'string'){
	  //param.push(__logid);
	  param.push(this.name);
  }
  console.log.apply(console, param);
  return this;
};

max = 0;

levels.forEach(function(name, k) {
  level2int[name] = k;
  max = Math.max(max, name.length);
  return Logger.prototype[name] = function() {
    this.type = name;
    return this.log.apply(this, arguments);
  };
});

levels.forEach(function(name, k) {
  return padlevels.push(name + new Array(max - name.length + 1).join(" "));
});
