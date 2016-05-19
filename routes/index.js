var express = require('express');
var  router = express.Router();

//首页
router.get("/",function(req,res){
    return res.json('this is index!');
});


module.exports = router;