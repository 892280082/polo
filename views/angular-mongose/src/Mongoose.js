/*
 * mongoose对象的构造器。这里定义了该对象的所有方法
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 * @API
 * ------------------------------------------------
 * 1.__link					链接数据库
 * 2.$getData				获取后台数据
 * 3.__setHttp				注入http服务
 * 4.$setCurPage			跳转到指定页
 * 5.$save					将数据保存到数据库,刷新当前页
 * 6.$remove				从数据库删除一条数据,刷新当前页. 如果当前页数据条数为0,则刷新上一页.
 * 7.$update				更新一条数据到数据库,刷新当前页.
 * 8.$search 				查询数据，页面刷新到第一页.
 * ------------------------------------------------
 * 
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

	//分页信息
	this.$pagingInfo = {
	    total:0,
	    curPage:1,
	    pageSize:20,
	    allPage:0,
	    waterfull:false,
	};

	//查询信息
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

	//查询对象
	this.$query = {};
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
Mongoose.prototype.__link = function(url){
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

/** @param  {Function} exec 回调函数 */
Mongoose.prototype.exec = function(exec){
	if(exec)
		this.$callback = exec;

	util.getData(this,exec);
};

/** @param  [number?] curPage 指定页数 */
Mongoose.prototype.$setCurPage = function(curPage){
	curPage = curPage || this.$pagingInfo.curPage;
	this.skip(curPage-1);
	this.exec(this.$callback);
};

Mongoose.prototype.$save = function(pojo,callback){
	util.save(pojo,callback,this);
};

Mongoose.prototype.$remove = function(pojo,callback){
	util.remove(pojo,callback,this);
};

Mongoose.prototype.$update = function(pojo,callback){
	util.update(pojo,callback,this);
};

Mongoose.prototype.$search = function(){
	this.skip(0).exec(this.$callback);
};