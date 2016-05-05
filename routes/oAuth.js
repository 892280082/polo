/***
 * @desc 第三方登陆的控制
 *       QQ快速登陆
 *       新浪微博登陆
 *       微信登陆
 * @auther yq
 * @email 892280082@qq.com
 * @date 2016/2/23
 */
var express = require('express'),
    router = express.Router(),
    oAuthConfig = require('../conf/oAuth_conf'),
    passport = require('passport'),
    qqStrategy = require('passport-qq').Strategy,
    WeiboStrategy = require('passport-weibo').Strategy;

var Customer;//Cus就是你的用户集合

/***
 * @desc 配置QQ第三方登陆
 */
router.use(passport.initialize());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});



if(oAuthConfig.qq.open) {
    passport.use(new qqStrategy(
        {
            clientID: oAuthConfig.qq.clientID,
            clientSecret: oAuthConfig.qq.clientSecret,
            callbackURL: oAuthConfig.qq.callbackURL
        },
        function (accessToken, refreshToken, profile, done) {
            var user = {
                openId:profile.id,
                name:profile.nickname,
                imgurl:profile._json.figureurl_qq_2
            };
            done(null,user);
        }
    ));

    router.get('/qq',passport.authenticate('qq'));

    router.get('/qq/callback',
        passport.authenticate('qq', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.

            Customer.getUserForThird('qq',req.user,(err,doc)=>{
                req.session.USER = doc;
                res.render('front/loginPage/auth_login.ejs');
            });

        });
}

/**
 * @desc 配置微博第三方登陆
 */
if(oAuthConfig.weibo.open){

    passport.use(new WeiboStrategy({
            clientID: oAuthConfig.weibo.clientID,
            clientSecret: oAuthConfig.weibo.clientSecret,
            callbackURL:oAuthConfig.weibo.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            var imgurl = profile._raw ? profile._raw.profile_image_url : '';
            var user = {
                openId:profile.id,
                name:profile.displayName,
                imgurl:imgurl
            };
            done(null,user);
        }
    ));

    router.get('/weibo',passport.authenticate('weibo'));
    router.get('/weibo/callback',
        passport.authenticate('weibo', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            Customer.getUserForThird('weibo',req.user,(err,doc)=>{
                req.session.USER = doc;
                res.render('front/loginPage/auth_login.ejs');
            });
        });

}

/**
 * @desc 配置微信三方登陆
 */
if(oAuthConfig.wechat.open){
    var wechatConfig = oAuthConfig.wechat;
    passport.use(new WechatStrategy({
            appID:wechatConfig.appID,
            //name:{默认为wechat,可以设置组件的名字}
            appSecret:wechatConfig.appSecret,
            client:wechatConfig.client,
            callbackURL:wechatConfig.callbackURL,
            scope:wechatConfig.scope,
            state:wechatConfig.state
            },function(accessToken, refreshToken, profile, done) {
                return done(null,profile);
            }
    ));

    router.get('/wechat',passport.authenticate('wechat'));

    router.get('/wechat/callback', passport.authenticate('wechat', {
        failureRedirect: '/auth/fail',
        successReturnToOrRedirect: '/'
    }));

}


module.exports = router;

