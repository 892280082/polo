/*!
 * angular-mongoose 模块。 封装Mongoose的增删改查与分页。
 * 让你可以前段调用后端的API
 * @auther yq
 * @Copyright(c) 2016 YeQin
 * @MIT Licensed
 */

/**
 * @`mongoose` API
 * ----------------------------------------------------------
 * 1.$link          添加后台API地址，返回一个mongoose实例 `mongooseEntity`。
 * 2.$toArray       把数组转换成分页对象，返回一个数组分页对象 `pagePojo`。						
 *
 * @`mongooseEntity` API 
 * ----------------------------------------------------------
 * 1.__link         链接数据库
 * 2.$getData       获取后台数据
 * 3.__setHttp      注入http服务
 * 4.$setCurPage    跳转到指定页
 * 5.$save          将数据保存到数据库,刷新当前页
 * 6.$remove        从数据库删除一条数据,刷新当前页. 如果当前页数据条数为0,则刷新上一页.
 * 7.$update        更新一条数据到数据库,刷新当前页.
 * 8.$search        查询数据，页面刷新到第一页.
 * 9.$query         查询对象   
 *
 * @`mongooseEntity.$query` 查询方法
 * @example
 * 1. a-b=x    ->    {a.b:x}
 * 2. $$_a=x   ->    {$regex: x ,$options: 'i'}
 * 3. $gt_a=x  ->   {a:$gt:x}
 * ..目前支持['$$_','$gt_','$gte_','$lt_','$lte_','$ne_']
 *
 * @`pagePojo` API 
 * ----------------------------------------------------------
 * 1.__init        初始化
 * 2.$setCurPage   跳转到制定页           
 * 3.$save         添加数据可传入对象和数组
 * 4.$remove       删除一条数据      
 * ----------------------------------------------------------
 *
 *@`mongoosePagin` 分页插件设置
 * ----------------------------------------------------------
 *@Example
 *<mongoose-pagin ng-model="`mongooseEntity`"></mongoose-pagin>
 *<mongoose-pagin ng-model="`pagePojo`"></mongoose-pagin>
 */

/**
 * Module dependencies.
 * @private
 */
var util = require('./src/util');
var Mongoose = require('./src/Mongoose');
var ArrayPagin = require('./src/ArrayPagin');
require('./src/anuglar-ui-pagin');

/**
 * Module exports.
 * @public
 */
var exportName;
module.exports = exportName = 'service_mongoose';

angular.module(exportName,['ui.bootstrap_pagination','mongoose-pagination.html'])
.service("mongoose",["$http",function($http){
	
	this.$link = function(url){
		return new Mongoose().__setHttp($http).__link(url);
	};

  this.$toArray = function(array,pageSize,waterfull){
    return new ArrayPagin().__init(array,pageSize,waterfull);
  };

}]).directive('mongoosePagin', [function(){
  return {
    scope: {
      ngModel:'=ngModel'
    }, 
    templateUrl:function(element, attrs) {return 'mongoose-pagination.html'},
    link: function($scope, iElm, iAttrs, controller) {

      $scope.$pagingInfo = $scope.ngModel.$pagingInfo;

      $scope.pageChanged = function(){
            $scope.ngModel.$setCurPage();
      };

    }
  };
}]);

angular.module("mongoose-pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mongoose-pagination.html",
  "<uib-pagination "+
      "class=\"pagination-sm\""+ 
      "boundary-links=\"true\""+
      "max-size=\"8\""+
      "ng-model=\"$pagingInfo.curPage\""+
      "ng-change=\"pageChanged()\""+
      "total-items=\"$pagingInfo.total\""+ 
      "items-per-page=\"$pagingInfo.pageSize\""+
      "num-pages=\"numPages\">"+
  "</uib-pagination>"
    );
}]);