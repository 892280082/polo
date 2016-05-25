var mongoose = require('../index');
require('../src/anuglar-ui-pagin');

/**
*  Module
*
* Description
*/
var app = angular.module('myApp', [mongoose,'ui.bootstrap','mongoose-pagination.html']);

app.controller('main', ['$scope','mongoose','$timeout'
	, function($scope,mongoose,$timeout){
	var salonDao;
	$scope.salonDao = salonDao = mongoose.$link('/back/curdSalon');

	salonDao.$getData({}).sort({creatTime:1}).limit(5).skip(0).waterfull(false).exec((err,doc)=>{
		console.log('doc:',doc);
	});

	$timeout(function() {
		console.log('load new');
		salonDao.$setCurPage(3);
	}, 2000);

}]);

app.directive('mongoosePagin', ['$log', function($log){
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