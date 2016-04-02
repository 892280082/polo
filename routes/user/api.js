var express = require('express'),
    router = express.Router();

//进入登陆页面
router.get('/index',function(req,res){
    return res.send("ok");
})

module.exports = router;