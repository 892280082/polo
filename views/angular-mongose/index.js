/*!
 * angular-mongoose 模块。 封装Mongoose的增删改查与分页。
 * 让你可以前段调用后端的API
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 * @API
 * ------------------------------------------------
 * 1.						
 * ------------------------------------------------
 */

/**
 * Module dependencies.
 * @private
 */
var util = require('./src/util');
var Mongoose = require('./src/Mongoose');
// var angular = require('angular');

/**
 * Module exports.
 * @public
 */
var exportName;
module.exports = exportName = 'service_mongoose';

angular.module(exportName,[])
.service("mongoose",["$http",function($http){
	this.$link = function(url){
		return new Mongoose().__setHttp($http).$link(url);
	};

}]);