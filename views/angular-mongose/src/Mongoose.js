/*!
 * mongoose对象的构造器。这里定义了该对象的所有方法
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 * @API
 * ------------------------------------------------
 * 1.$link					链接数据库
 * 2.$getData				获取后台数据	
 * 3.__setHttp				设置服务
 * 4.$setCurPage			跳转到指定页										
 * ------------------------------------------------
 */

/**
 * Module dependencies.
 * @private
 */
var util = require('./util');
var log = require('./log');

/**
 * Module exports.
 * @public
 */
var Mongoose;

module.exports = Mongoose =  function(){

	this.$pagingInfo = {
	    total:0,
	    curPage:1,
	    pageSize:20,
	    allPage:0,
	    waterfull:false,
	};

	this.$searchInfo = {
	    query:{},
	    sort:null,
	    populate:null,
	    url:null,//后台地址
	};

	//注入angular的服务
	this.$service = {
		$http:null
	};

	//前台显示的对象
	this.$array = [];

	//回调函数
	this.$callback = null;
};

/**
 * [__setHttp 添加angular服务]
 * @param  {[type]} http $http服务
 * @return {mongoose} 返回mongoose对象  
 */
Mongoose.prototype.__setHttp = function(http){
	this.$service.$http = http;
	return this;
};

/**
 * @param  {String} url 后台地址
 * @return {mongoose} 返回mongoose对象     
 */
Mongoose.prototype.$link = function(url){
	util.checkSetting(this);

	this.$searchInfo.url = url;
	return this;
};

/**
 * @param  {Object}   query     查询条件
 * @param  {Object}   condition 分页条件
 * @param  {Function} callback  (err,paginObject)
 */
Mongoose.prototype.$getData = function(query,condition,callback){
	util.checkSetting(this);

	this.$searchInfo.query = query;

	if(condition)
		util.merge(this.$searchInfo,condition);

	if(!callback)
		return this;

	util.getData(this,callback);
};

/**
 * 联合查询
 * limit sort skip exec
 */
Mongoose.prototype.limit = function(limit){
	this.$pagingInfo.pageSize = limit;
	return this;
};

Mongoose.prototype.sort = function(sort){
	this.$searchInfo.sort = sort;
	return this;
};

Mongoose.prototype.skip = function(skip){
	this.$pagingInfo.curPage = skip+1;
	return this;
};

Mongoose.prototype.waterfull = function(flag){
	this.$pagingInfo.waterfull = !!flag;
	return this;
};

/**
 * @param  {Function} exec 回调函数
 */
Mongoose.prototype.exec = function(exec){
	if(exec)
		this.$callback = exec;

	util.getData(this,exec);
};

Mongoose.prototype.$setCurPage = function(curPage){
	this.skip(curPage-1);
	this.exec(this.$callback);
};