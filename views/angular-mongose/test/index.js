var mongoose = require('../index');
require('../src/anuglar-ui-pagin');

/**
*  Module
*
* Description
*/
var app = angular.module('myApp', [mongoose,'ui.bootstrap.pagination']);

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


  $scope.totalItems = 64;
  $scope.currentPage = 4;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };

  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;

}]);