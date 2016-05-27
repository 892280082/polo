/*!
 * min版underscore
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 * @API
 * ------------------------------------------------
 * 1.						
 * ------------------------------------------------
 */

var _;

/**
 * Module exports.
 * @public
 */
module.exports = _ = {};


_.find = function(array,itera){
	for(var i=0;i<array.length;i++){
		if(itera(array[i]))
			return array[i];
	}
};

_.isObject = function(obj){
	return obj instanceof Object;
};

_.keys = function(obj){
	var i=0;
	for(var p in obj){
		i++;
	}
	return i;
};

_.mapObject = function(obj,itera){
	for(var p in obj){
		itera(obj[p],p);
	}
};

_.has = function(obj,key){
	for(var p in obj){
		if(p === key)
			return true;
	}
	return false;	
};