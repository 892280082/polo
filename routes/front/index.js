var express = require('express');
var router = express.Router();
var then = require('thenjs');
var _ = require("underscore");
var Person = require("../../models/Person");
var Story = require("../../models/Story");
var mongooseUtil = require('../../util/mongooseUtil');

//进入登陆页面
router.get('/index',function(req,res){
	return res.render('front/test/index' );
})

router.get('/insert',function(req,res){
	then(function(next){
		var person = {
			name:"aa"+ _.random(1,100),
			age: _.random(18,30),
		}
		person = new Person(person);
		person.save(function(err){
		});
		next(err);
	}).then(function(){
		Person.find({},function(err,docs){
			return res.json(docs);
		})
	})
})

//作者  aa81   56fd38859119e3550a9212b9
//粉丝  28  56fd389ed9c54e610ad89a7a
//     22 56fd38a8becb80650a0306da
//
router.get('/insertStory',function(req,res){
	then(function(next){
		var story = {
			_creator:"56fd38859119e3550a9212b9",
			title:"系列丛书"+ _.random(0,10),
			fans:["56fd38a8becb80650a0306da","56fd38a8becb80650a0306da"]
		}
		story = new Story(story);
		story.save(function(err){
			next(err);
		});
	}).then(function(){
		Story.find({},function(err,docs){
			return res.json(docs);
		})
	})
})

router.get('/findAll',function(req,res){
	Story.findOne({}).populate('_creator').populate('fans').exec(function(err,docs){
		res.json(docs);
	})
})

router.post('/savePerson',function(req,res){
	mongooseUtil.saveSingle(req.body.pushPojo,Person,function(err,doc){
		res.json({err:err,result:doc});
	})
});

router.post('/getPersonList',function(req,res){
	mongooseUtil.pagination({
		query:req.body.query,
		limit:req.body.limit,
		skip:req.body.skip*req.body.limit,
		sort:req.body.sort,
		model:Person,
	},function(err,result){
		res.json({err:err,result:result});
	})
});

router.post('/deletePerson',function(req,res){
	mongooseUtil.removeSingleById(req.body._id,Person,function(err,info){
		res.json({err:err,result:info});
	})
});

router.post('/updatePerson',function(req,res){
	mongooseUtil.updateSingleById(req.body.updatePojo,Person,function(err,info){
		res.json({err:err,result:info});
	})
});

//测试
mongooseUtil.createBaseCurd('/getPersonAll',Person,function(req,res){
	this.pagination({
		req:req,
	},function(err,result){
		res.json({err:err,result:result});
	})
},router);



module.exports = router;