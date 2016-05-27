/*!
 * 数据变成分页对象
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 * @API
 * ------------------------------------------------
 * 1.__init				初始化
 * 2.$setCurPage		跳转到制定页
 * 3.$save				添加一个对象
 * 4.$remove			删除一个对象				
 * ------------------------------------------------
 */

/**
 * Module dependencies.
 * @private
 */
var util = require('./util');

/**
 * Module exports.
 * @public
 */
var ArrayPagin;
module.exports = ArrayPagin = function(){
	//分页信息
	this.$pagingInfo = {
	    total:0,
	    curPage:1,
	    pageSize:20,
	    allPage:0,
	    waterfull:false,
	};

	//显示对象
	this.$array = [];

	//缓存
	this._array = [];
};

ArrayPagin.prototype.__init = function(array,pageSize,waterfull){
	var pagingInfo = this.$pagingInfo;

	this._array = array || this._array;

	pagingInfo.total = this._array.length;

	pagingInfo.pageSize = pageSize || pagingInfo.pageSize;

	pagingInfo.waterfull = waterfull || pagingInfo.waterfull;

	pagingInfo.allPage = util.juageAllPage(pagingInfo.pageSize,pagingInfo.total);

	return this.$setCurPage();
};

ArrayPagin.prototype.$setCurPage = function(curPage){
		var pagingInfo = this.$pagingInfo;
		if(curPage)
			pagingInfo.curPage = curPage;

		this.$array = util.getSlice(this._array,pagingInfo.curPage,pagingInfo.pageSize);
		return this;
};

/**@param {Object|Array} pojo 添加数组或者对象  */
ArrayPagin.prototype.$save = function(pojo){
	pojo instanceof Array ? this._array = this._array.concat(pojo) 
						  : this._array.push(pojo);

	this.__init();
	return this;	
};

ArrayPagin.prototype.$remove = function(pojo){
	util.arrayRemovePojo(this._array,pojo);
	this.$init();
	return this;
};
