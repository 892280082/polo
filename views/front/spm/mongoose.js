var mongoose = require('yq-ng-mongoose');


/**
*  Module
*
* Description
*/
angular.module('myApp', [mongoose])
.controller('main', ['$scope','mongoose', function($scope,mongoose){
	$scope.salonDao = mongoose.$link('/back/curdSalon');

	$scope.salonDao.$find({},(err,doc)=>{
		console.log('salonDao',$scope.salonDao);
	});

}]);