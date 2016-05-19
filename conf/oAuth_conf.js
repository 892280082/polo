var config = require('./app_config');
/**
 * @desc 三方登陆账号配置
 * */
var getCallbackUrl = (url)=>{
    return config.main.root+'/auth'+url;
};

module.exports = {
    /**
     * @desc QQ第三方登陆数据
     * */
    qq:{
        open:true,
        clientID:"***",
        clientSecret:"***",
        callbackURL:getCallbackUrl("/qq/callback"),
    },
    weibo:{
        open:true,
        clientID:"***",
        clientSecret:"***",
        callbackURL:getCallbackUrl('/weibo/callback')
    },
    wechat:{
        open:false,
        appID:"",
        appSecret:"",
        client:"web",//{wechat[微信]|web[网站]}
        callbackURL:"***",
        scope:"snsapi_base",//{snsapi_userinfo [多信息] | snsapi_base [仅获取基本信息]}
        state:"STATE"
    },
};
