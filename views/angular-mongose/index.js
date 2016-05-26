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

/**
 * Module exports.
 * @public
 */
var exportName;
module.exports = exportName = 'service_mongoose';

angular.module(exportName,['ui.bootstrap','mongoose-pagination.html'])
.service("mongoose",["$http",function($http){
	
	this.$link = function(url){
		return new Mongoose().__setHttp($http).$link(url);
	};

}]).directive('mongoosePagin', ['$log', function($log){
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