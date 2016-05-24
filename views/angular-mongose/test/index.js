var mongoose = require('../index');

/**
*  Module
*
* Description
*/
var app = angular.module('myApp', [mongoose]);

app.controller('main', ['$scope','mongoose', function($scope,mongoose){
	var salonDao;
	$scope.salonDao = salonDao = mongoose.$link('/back/curdSalon');

	// salonDao.$getData({},{limit:5,sort:{creatTime:1}},(err,doc)=>{
	// 	console.log(err,doc);
	// });

	salonDao.$getData({}).sort({creatTime:1}).limit(3).skip(1).exec((err,doc)=>{
		console.log(err,doc);

	});


	setTimeout(()=>{
		console.log('salonDao',salonDao);
	},300);

}]);