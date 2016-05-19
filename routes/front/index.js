var express = require('express');
var router = express.Router();
var then = require('yqthen');
var _ = require("underscore");
var mongooseUtil = require('../../util/mongooseUtil');
var Comment = require("../../models/Comment.js");
var Config = require("../../models/Config.js");
var Salon = require("../../models/Salon.js");
var frontMiddle = require("../../middleware/front_mw.js");
var Student  = require('../../models/Student');


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
	Salon.find({},(err,docs)=>{
		res.json({err:err,result:docs});		
	});
});

router.get('/addStu',(req,res)=>{
	var student = {
		name:"张三"+_.random(10,100),
		age:_.random(10,100),
	};

	Student.create(student,(err)=>{
		res.json({err:err});
	});



});

router.get('/stuList',(req,res)=>{
	Student.find({name:'张三'},(err,docs)=>{
		res.json({result:docs});
	});
});


module.exports = router;

