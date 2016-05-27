var mongoose = require('../index');

/**
*  Module
*
* Description
*/
var app = angular.module('myApp', [mongoose]);

app.controller('main', ['$scope','mongoose','$timeout'
	, function($scope,mongoose,$timeout){

	var salonDao;
	$scope.salonDao = salonDao = mongoose.$link('/back/curdSalon');


	salonDao.$getData({}).sort({creatTime:-1}).limit(5).skip(0).waterfull(false).exec((err,doc)=>{
		console.log('doc:',doc);

	});

	// $scope.arrayPagin.$save(doc);

	// $scope.arrayPagin = mongoose.$toArray([],6);


	$scope.addNewPojo = ()=>{
		salonDao.$save({title:"newasdfsdf",qq:'56745676jk'});
	};

	$scope.removePojo = (pojo)=>{
		salonDao.$remove(pojo,(err,info)=>{x
			console.log('remove- -->',err,info);
		});	
	};

	$scope.updateLason = (pojo)=>{
		pojo.title = "修改过的"+pojo.title;
		salonDao.$update(pojo,(err,info)=>{
			console.log('update- -->',err,info);
		});	
	};

	$scope.searchPojo = function(){
		salonDao.$search();
	};



}]);

