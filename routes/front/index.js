var express = require('express');
var router = express.Router();
var then = require('thenjs');
var _ = require("underscore");
var mongooseUtil = require('../../util/mongooseUtil');
var Comment = require("../../models/Comment.js");
var Config = require("../../models/Config.js");
var Salon = require("../../models/Salon.js");


router.use("*",(req,res,next)=>{
	var deviceAgent = req.headers['user-agent'].toLowerCase();
	console.log(deviceAgent);
	var agentId = deviceAgent.match(/(iphone|ipod|ipad|android)/);
	console.log("agentId",agentId);
	if(agentId){
		next();
	}else{
		return false;
	}
});

//会所列表页面
router.get('/toSalonList',function(req,res){
    Salon.find({state:1}).sort({sort:-1}).exec(function(err,docs){
        if(err)
            next(err);
        res.render("front/page/salonList",{salons:docs});
    })
});

//会所顾客反馈页面
router.get('/toSalonCusBack',function(req,res){
    res.render("front/page/ly");
});



module.exports = router;