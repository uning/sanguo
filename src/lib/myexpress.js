
//process.env.DEBUG='*';

var debug =  require('debug')('myexpress')

var Router = require('express/lib/router');
var Route  = require('express/lib/router/route');
var utils  = require('express/lib/utils');

/**
 * 修改route 方法，可以动态加载和替换Route
 * 原来的重新加载后，直接在push一个Route在后面
 *
 * @param {String} method
 * @param {String} path
 * @param {Function} callback...
 * @return {Router} for chaining
 * @api private
 */
Router.prototype.route = function(method, path, callbacks){
  var method = method.toLowerCase()
    , callbacks = utils.flatten([].slice.call(arguments, 2));

  // ensure path was given
  if (!path) throw new Error('Router#' + method + '() requires a path');

  // create the route
  debug('defined %s %s', method, path);
  var route = new Route(method, path, callbacks, {
	  sensitive: this.caseSensitive
	  , strict: this.strict
  });

  // add it
  //(this.map[method] = this.map[method] || [])//.push(route);
  (this.map[method] = this.map[method] || [])//.push(route);

  var myups = this.myuniqpaths = this.myuniqpaths || {};
  var cups = myups[method] =  myups[method] || {};
  if(path in cups){
	  var idx = cups[path];
	  this.map[method][idx] = route;

  }else{
	  (this.map[method] = this.map[method] || []).push(route);
	  cups[path] = this.map[method].length - 1;
  }
  (this.myuniq = this.map[method] || [])//.push(route);

  return this;
};

var express = module.exports = require('express')

//debug('express.Router',express.Router.prototype.route);
