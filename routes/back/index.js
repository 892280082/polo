var express = require('express');
var router = express.Router();
var then = require('yqthen');
var _ = require("underscore");
var mongooseUtil = require('../../util/mongooseUtil');
var Comment = require("../../models/Comment.js");
var Config = require("../../models/Config.js");
var Salon = require("../../models/Salon.js");
var logUtil = require('../../util/logUtil')('/routes/back/index.js');

//后台主页面
router.get('/main',function(req,res){
	res.render("back/main/index");
});

//后台头部页面
router.get('/main_top',function(req,res){
	res.render("back/main/main_top");
});

//后台左边引导栏目页面
router.get('/main_left',function(req,res){
	res.render("back/main/main_left");
});

//沙龙列表页面
router.get('/toSalon',function(req,res){
	res.render('back/page/salon');
});

//沙龙curd
mongooseUtil.createBaseCurd('/curdSalon',Salon,function(req,res){
	this.pagination({
		req:req,
	},function(err,result){
		res.json({err:err,result:result});
	});
},router);



module.exports = router;