var express = require('express');
var router = express.Router();
var then = require('yqthen');
var _ = require("underscore");
var mongooseUtil = require('../../util/mongooseUtil');
var Comment = require("../../models/Comment.js");
var Config = require("../../models/Config.js");
var Salon = require("../../models/Salon.js");
var frontMiddle = require("../../middleware/front_mw.js");


//会所列表页面
router.get('/toSalonList',function(req,res){
    Salon.find({state:1}).sort({sort:-1}).exec(function(err,docs){
        if(err)
            next(err);
        res.render("front/page/salonList",{salons:docs});
    });
});

//会所顾客反馈页面
router.get('/toSalonCusBack',function(req,res){
    res.render("front/page/ly");
});

router.get('/toTest',frontMiddle.toTest_name,(req,res)=>{
	res.send(res.locals.name);
});

router.get('/test',(req,res)=>{
	res.send("hello world");
});

module.exports = router;

